import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import treasuryIcon from "@/assets/treasury-icon.jpg";
import { useAccount, useWalletClient, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { parseEther, formatEther, formatUnits } from "viem";


const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

type Holding = {
  token_name: string;
  token_symbol: string;
  token_contract_address: string;
  balance: number; 
  price: number;
  value: number;
  photo_url?: string;
};

type TreasuryAPI = {
  wallet_address: string;
  total_tokens: number;
  total_value_usd: string;
  holdings: Holding[];
};

const TREASURY_API =
  "https://unicorn.pharmaalabs.com/v1/arena-token/treasury-tokens";

// small helpers
const isValidAddress = (addr?: string) =>
  !!addr && ethers.isAddress(addr);

const formatUsd = (v: number | string) => {
  const n = typeof v === "string" ? parseFloat(v) : v;
  if (Number.isNaN(n)) return "$0.00";
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
};

const formatPrice = (price: number) => {
  if (price < 0.000001) {
    return `$${price.toExponential(2)}`;
  }
  return `$${price.toFixed(6)}`;
};

const formatNumberShort = (n: number | string) =>
  typeof n === "number" ? n.toLocaleString() : String(n);

const AVAX_NATIVE_SYMBOL = "AVAX";


const Treasury = () => {
  const { toast } = useToast();
  const { address: userAddress, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { chain } = useNetwork();
  const [avaxBalance,setAvaxBalance] = useState('')
  const [loading, setLoading] = useState<boolean>(false);
  const [treasury, setTreasury] = useState<TreasuryAPI | null>(null);
  const [selectedTokenAddr, setSelectedTokenAddr] = useState<string>(""); 
  const [tokenContractInput, setTokenContractInput] = useState<string>(""); // controlled input
  const [selectedTokenMeta, setSelectedTokenMeta] = useState<{
    name?: string;
    symbol?: string;
    decimals?: number;
    photo_url?: string;
    isNative?: boolean;
    contractAddress?: string | null;
    userBalance?: string | null; 
  } | null>(null);


  const fetchTreasury = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        'https://unicorn.pharmaalabs.com/v1/arena-token/treasury-tokens',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      const json = await res.json();
      if (json?.isSuccess && json?.result) {
        setTreasury(json.result as TreasuryAPI);
        if (json.result.holdings?.length) {
          setSelectedTokenAddr(json.result.holdings[0].token_contract_address);
        } else {
          setSelectedTokenAddr("AVAX");
        }
      } else {
        toast({
          title: "Failed",
          description: "Treasury API returned an error",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("fetchTreasury:", err);
      toast({
        title: "Error",
        description: "Could not fetch treasury data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreasury();
  }, []);

  useEffect(() => {
    let canceled = false;
    const fetchMeta = async () => {
      if (!selectedTokenAddr) {
        setSelectedTokenMeta(null);
        return;
      }

      // If native AVAX selected
      if (selectedTokenAddr === "AVAX") {
        try {
          let userBalHuman = null;
          if (walletClient && userAddress && chain) {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const b = await provider.getBalance(userAddress);
            userBalHuman = formatEther(b);
          }
          if (!canceled)
            setSelectedTokenMeta({
              isNative: true,
              symbol: AVAX_NATIVE_SYMBOL,
              name: "Avalanche",
              decimals: 18,
              contractAddress: null,
              userBalance: userBalHuman,
            });
        } catch (err) {
          console.warn("get AVAX balance error", err);
          if (!canceled)
            setSelectedTokenMeta({
              isNative: true,
              symbol: AVAX_NATIVE_SYMBOL,
              name: "Avalanche",
              decimals: 18,
              contractAddress: null,
            });
        }
        return;
      }

      // if valid contract address fetch via ERC20 minimal ABI
      if (!isValidAddress(selectedTokenAddr)) {
        setSelectedTokenMeta(null);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const contract = new ethers.Contract(selectedTokenAddr, ERC20_ABI, provider);

        // Read in parallel
        const [name, symbol, decimals] = await Promise.all([
          contract.name().catch(() => null),
          contract.symbol().catch(() => null),
          contract.decimals().catch(() => 18),
        ]);
        let userBalHuman = null;
        if (userAddress) {
          try {
            const raw = await contract.balanceOf(userAddress);
            userBalHuman = formatUnits(raw, decimals ?? 18);
          } catch (err) {
            // ignore
          }
        }

        if (!canceled)
          setSelectedTokenMeta({
            isNative: false,
            symbol: symbol ?? undefined,
            name: name ?? undefined,
            decimals: decimals ?? 18,
            contractAddress: selectedTokenAddr,
            userBalance: userBalHuman,
          });
      } catch (err) {
        console.error("fetch token meta", err);
        if (!canceled) setSelectedTokenMeta(null);
      }
    };

    fetchMeta();
    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTokenAddr, walletClient, userAddress]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-8">
        <p className="text-center">Loading treasury...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <img src={treasuryIcon} alt="Treasury" className="w-14 h-14 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold">Treasury Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage treasury holdings & deposits</p>
          </div>
        </div>

        <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Total Value</p>
            <p className="text-lg font-bold">
              {treasury ? formatUsd(treasury.holdings?.reduce((sum, holding) => sum + holding.value, 0) || 0) : "$0.00"}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Total Tokens</p>
            <p className="text-lg font-bold">{treasury ? treasury.total_tokens : 0}</p>
          </Card>
        </div>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Treasury Wallet</p>
            <p className="font-mono text-sm break-all">
              {treasury?.wallet_address ?? "—"}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (treasury?.wallet_address) {
                    navigator.clipboard.writeText(treasury.wallet_address);
                    toast({ title: "Copied", description: "Treasury wallet copied" });
                  }
                }}
              >
                <Copy className="w-4 h-4" /> Copy
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  window.open(
                    `https://snowtrace.io/address/${treasury?.wallet_address}`,
                    "_blank"
                  )
                }
              >
                <ExternalLink className="w-4 h-4" /> View
              </Button>
            </div>
          </div>
        </Card>


        <Card className="p-4">
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-semibold">Treasury Holdings</h3>
    <Badge>{treasury?.holdings?.length ?? 0} tokens</Badge>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-muted-foreground border-b">
          <th className="py-2">Token</th>
          <th className="py-2">Balance</th>
          <th className="py-2">Price</th>
          <th className="py-2">Value (USD)</th>
        </tr>
      </thead>
      <tbody>
        {treasury?.holdings?.map((h, idx) => (
          <tr
            key={idx}
            className="border-b last:border-0 hover:bg-muted/10 transition"
          >
            <td className="flex items-center gap-2 py-2">
              <img
                src={h.photo_url}
                alt={h.token_symbol}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold">{h.token_symbol}</div>
                <div className="text-xs text-muted-foreground">
                  {h.token_name}
                </div>
              </div>
            </td>
            <td className="py-2 font-medium">{formatNumberShort(h.balance)}</td>
            <td className="py-2">${h.price.toFixed(6)}</td>
            <td className="py-2">{formatUsd(h.value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</Card>

      </div>

      </div>
    </div>
  );
};

export default Treasury;