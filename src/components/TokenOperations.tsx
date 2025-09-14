"use client";

import { useEffect, useRef, useState } from "react";
import { parseEther, formatEther } from "viem";
import { useEERCContext } from "../context/EERCContext";
import { getExplorerUrl, formatBalance, cn } from "../lib/utils";
import { erc20ABI, useAccount, useBalance, useContractWrite } from "wagmi";
import { TokenBatcher } from "../lib/batchReadCalls";
import { standardWatchOptions } from "../lib/wagmiConfig";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, AlertTriangle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type OperationType = "deposit" | "withdraw";

export default function TokenOperations() {
  const {
    isConnected,
    chain,
    tokenAddress,
    eerc,
    encryptedBalance,
    contractAddress,
    publicClient,
  } = useEERCContext();
  const { address } = useAccount();
  console.log({encryptedBalance})
  const [operationType, setOperationType] = useState<OperationType>("deposit");
  const [amount, setAmount] = useState("");
  const [approvedAmount, setApprovedAmount] = useState<bigint>(0n);
  const [isApproving, setIsApproving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: tokenBalanceData } = useBalance({
    address,
    token: tokenAddress as `0x${string}`,
    ...standardWatchOptions,
    enabled: !!address && !!tokenAddress,
  });

  const isMainnet = chain?.id === 43114;

  const { writeAsync: approveTokens } = useContractWrite({
    address: tokenAddress as `0x${string}`,
    abi: erc20ABI,
    functionName: "approve",
  });

  const batcherRef = useRef<TokenBatcher | null>(null);

  useEffect(() => {
    if (!publicClient || !tokenAddress || !contractAddress || !address) {
      batcherRef.current = null;
      return;
    }
    if (!batcherRef.current) {
      batcherRef.current = new TokenBatcher(
        publicClient,
        tokenAddress as `0x${string}`,
        contractAddress,
        address as `0x${string}`
      );
    } else {
      batcherRef.current.setUserAddress(address as `0x${string}`);
    }
  }, [publicClient, tokenAddress, contractAddress, address]);

  useEffect(() => {
    const fetchAllowance = async () => {
      if (!batcherRef.current) return;
      try {
        const allowance = await batcherRef.current.getAllowance();
        setApprovedAmount(allowance);
      } catch (e) {
        console.error("Error fetching allowance:", e);
      }
    };
    fetchAllowance();
    setAmount('');
    const interval = setInterval(fetchAllowance, 15000);
    return () => clearInterval(interval);
  }, [address, tokenAddress, contractAddress, publicClient, txHash]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(val);
  };

  const handleMaxClick = () => {
    if (operationType === "deposit" && tokenBalanceData) {
      setAmount(tokenBalanceData.formatted);
    } else if (operationType === "withdraw" && encryptedBalance) {
      setAmount(formatBalance(encryptedBalance.decryptedBalance));
    }
  };

  const handleApprove = async () => {
    if (!tokenAddress || !contractAddress || !amount) return;
    setIsApproving(true);
    setError(null);

    try {
      const amountWei = parseEther(amount);
      const result = await approveTokens({
        args: [contractAddress, amountWei],
      });
      setTxHash(result.hash);
      toast.success("Approval transaction sent!");

      setTimeout(async () => {
        if (!batcherRef.current) return;
        batcherRef.current.invalidateCache();
        const allowance = await batcherRef.current.getAllowance(true);
        setApprovedAmount(allowance);
        toast.success("Approval confirmed!");
        setAmount('');
      }, 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Approval failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsApproving(false);
    }
  };

  const handleOperation = async () => {
    if (!encryptedBalance || !amount || isNaN(Number(amount))) return;
    setIsProcessing(true);
    setError(null);
    setTxHash(null);

    try {
      const amountWei = parseEther(amount);

      if (operationType === "deposit") {
        let allowance = approvedAmount;
        if (batcherRef.current) {
          allowance = await batcherRef.current.getAllowance(true);
          setApprovedAmount(allowance);
        }
        if (allowance < amountWei) {
          const msg = "Insufficient approval. Please approve tokens first.";
          setError(msg);
          toast.error(msg);
          setIsProcessing(false);
          return;
        }
      }
      const result =
        operationType === "deposit"
          ? await encryptedBalance.deposit(amountWei)
          : await encryptedBalance.withdraw(amountWei);

      setTxHash(result.transactionHash);
      toast.success(
        `${operationType === "deposit" ? "Deposit" : "Withdraw"} transaction sent!`
      );

      setTimeout(() => {
        encryptedBalance.refetchBalance();
        if (batcherRef.current) {
          batcherRef.current.invalidateCache();
          batcherRef.current.getAllowance(true).then(setApprovedAmount);
        }
        toast.success(
          `${operationType === "deposit" ? "Deposit" : "Withdraw"} confirmed!`
        );
        setAmount('');
      }, 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Operation failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-slate-900/70 border border-slate-700 rounded-3xl p-6 text-white shadow-xl shadow-[#8A2BE2]/20 backdrop-blur-xl max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-2 text-center text-white">
          Token Operations
        </h2>
        <p className="text-sm text-slate-400 text-center">
          Please connect your wallet to proceed.
        </p>
      </div>
    );
  }

  if (eerc && !eerc.isRegistered) {
    return (
      <div className="bg-slate-900/70 border border-slate-700 rounded-3xl p-6 text-white shadow-xl shadow-[#8A2BE2]/20 backdrop-blur-xl max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-2 text-center text-white">
          Token Operations
        </h2>
        <p className="text-sm text-slate-400 text-center">
          You need to register before performing token operations.
        </p>
      </div>
    );
  }

  if (!eerc?.isInitialized || !encryptedBalance) {
    return (
      <div className="bg-slate-900/70 border border-slate-700 rounded-3xl p-6 text-white shadow-xl shadow-[#8A2BE2]/20 backdrop-blur-xl max-w-lg mx-auto animate-pulse">
        <h2 className="text-2xl font-bold mb-2 text-center text-white">
          Loading Token Operations...
        </h2>
      </div>
    );
  }

  return (
    <>
    <Toaster position="bottom-right" />
    {(isProcessing || isApproving) && (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="h-14 w-14 sm:h-16 sm:w-16 animate-spin rounded-full border-4 border-t-primary border-b-muted-foreground border-muted/30" />
      </div>
    )}
  
    <div className="glass border-card-border shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-smooth animate-fade-in-up animation-delay-800 max-w-lg mx-auto mt-6 rounded-2xl p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
        Deposit / Withdraw
      </h2>
      <div className="grid grid-cols-2 gap-6 mb-6 text-center">
        <div>
          <p className="text-muted-foreground text-sm">Holdings</p>
          <p className="text-foreground font-semibold text-lg">
            {tokenBalanceData
              ? `${parseFloat(tokenBalanceData.formatted).toFixed(4)} ${tokenBalanceData.symbol}`
              : "0 Tokens"}
          </p>

        </div>
        <div>
          <p className="text-muted-foreground text-sm">Confidential Balance</p>
          <p className="text-foreground font-semibold text-lg">
            {formatBalance(encryptedBalance.decryptedBalance)} Encrypted
          </p>
        </div>
      </div>
      <div
        className="relative flex rounded-xl border border-card-border bg-gradient-to-br from-background/80 via-background to-background/60 shadow-md shadow-primary/10 mb-6 overflow-hidden select-none"
        role="tablist"
      >
        <div
          className="absolute top-0 left-0 h-full w-1/2 bg-gradient-primary glow-primary rounded-xl transition-transform duration-500 ease-out"
          style={{
            transform:
              operationType === "withdraw"
                ? "translateX(100%)"
                : "translateX(0%)",
          }}
        />
        {["deposit", "withdraw"].map((type) => (
          <button
            key={type}
            onClick={() => setOperationType(type as OperationType)}
            className={cn(
              "relative z-10 flex-1 px-4 py-2 text-sm font-semibold transition-all duration-300",
              operationType === type
                ? "text-black"
                : "text-muted-foreground hover:text-white"
            )}
            role="tab"
            aria-selected={operationType === type}
            type="button"
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
  
      <div className="mb-6 relative">
        <input
          type="text"
          inputMode="decimal"
          placeholder="Amount"
          className="block w-full rounded-xl border border-card-border bg-background/80 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          value={amount}
          onChange={handleAmountChange}
        />
        <button
          onClick={handleMaxClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-gradient-accent text-accent-foreground px-3 py-1 text-xs font-semibold hover:glow-accent transition-smooth"
          type="button"
        >
          Max
        </button>
      </div>
  
      {/* Approve (only for deposit) */}
      {operationType === "deposit" && (
        <div className="my-6">
          <p className="text-sm text-foreground mb-2">
            Approved: {parseFloat(formatBalance(approvedAmount)).toFixed(4)} Assets
          </p>
          <button
            disabled={
              isApproving || isProcessing || !amount || Number(amount) <= 0
            }
            onClick={handleApprove}
            className="w-full text-black flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary-foreground rounded-xl bg-gradient-primary glow-primary hover:scale-[1.03] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApproving ? "Approving..." : "Approve"}
          </button>
        </div>
      )}
  
      <button
        onClick={handleOperation}
        disabled={
          isProcessing ||
          isApproving ||
          !amount ||
          Number(amount) <= 0 ||
          (operationType === "deposit" && approvedAmount < parseEther(amount))
        }
        className="w-full text-black flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary-foreground rounded-xl bg-gradient-secondary hover:scale-[1.03] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing
          ? operationType === "deposit"
            ? "Depositing..."
            : "Withdrawing..."
          : operationType === "deposit"
          ? "Deposit"
          : "Withdraw"}
      </button>
  
      {/* Transaction Hash */}
      {txHash && (
        <p className="mt-4 text-sm text-accent text-center">
          Transaction Hash:{" "}
          <a
            href={getExplorerUrl(txHash, 43114)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-accent/80"
          >
            {txHash.slice(0, 8)}...{txHash.slice(-6)}
          </a>
        </p>
      )}
  
      {/* Error */}
      {error && (
        <div className="mt-4 text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
          <AlertTriangle size={16} /> {error}
        </div>
      )}
  
      {/* Note */}
      {isMainnet && (
        <p className="mt-4 text-xs text-muted-foreground text-center">
          This contract is running on the testnet.
        </p>
      )}
    </div>
  </>
  );
}
