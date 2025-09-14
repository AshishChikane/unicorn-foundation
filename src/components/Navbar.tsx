import { useState, useEffect } from "react";
import {
  Wallet,
  Shield,
  ChevronDown,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Navbar({
  onTransferClick,
  onPromptClick,
}: {
  onTransferClick: () => void;
  onPromptClick: () => void;
}) {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAddresses, setWalletAddresses] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or a compatible wallet.");
      return;
    }

    try {
      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setIsWalletConnected(true);
        setWalletAddresses(accounts);
        setWalletAddress(accounts[0]);
      }
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
    setWalletAddresses([]);
  };

  const handleAddressSwitch = (addr: string) => {
    setWalletAddress(addr);
  };

  const shortAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-slate-900/90" : "bg-transparent"
      } backdrop-blur-lg border-b border-purple-500/30`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">


          <div className="hidden md:flex items-center space-x-3">
            {!isWalletConnected ? (
              <Button
                onClick={connectWallet}
                size="sm"
                className="px-6 py-5 text-md font-semibold bg-gradient-to-r from-cyan-500 to-[#8A2BE2] text-white rounded-full"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white">
                    {shortAddress(walletAddress)}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {walletAddresses.map((addr) => (
                    <DropdownMenuItem
                      key={addr}
                      onClick={() => handleAddressSwitch(addr)}
                    >
                      {shortAddress(addr)}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem onClick={disconnectWallet}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              className="text-white hover:bg-slate-800/50 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
