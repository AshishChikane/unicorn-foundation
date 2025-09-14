import { ConnectKitButton } from "connectkit";
import { displayFullAddress } from "../lib/utils";
import { Link } from "react-router-dom";
import { Menu, Wallet, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface HeaderProps {
  network: "mainnet" | "testnet";
  connectedAddress: string | null;
  setConnectedAddress: (addr: string | null) => void;
  setDecryptionKey: (addr: string | null) => void;
}

export default function Header({
  network,
  connectedAddress,
  setConnectedAddress,
  setDecryptionKey,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const shortAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "About", path: "/about" },
    { name: "Treasury", path: "/treasury" },
    // { name: "Swap", path: "/swap" },
    { name: "Bridge", path: "/bridge" },
    { name: "EERC", path: "/eerc" },
  ];

  return (
  <header className="fixed top-0 left-0 bg-black right-0 z-50 glass border-b border-card-border">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center glow-primary">
            <span className="text-white font-bold text-lg">🦄</span>
          </div>
          <span className="text-xl font-bold text-white">UnicornDAO</span>
        </Link>
  
        <div className="hidden md:flex items-center space-x-8 ml-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-2 py-2 rounded-md text-sm font-medium transition-smooth ${
                isActive(item.path)
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
  
        <ConnectKitButton.Custom>
          {({ isConnected, isConnecting, show, address }) => {
            if (isConnected && address && address !== connectedAddress) {
              setConnectedAddress(address);
            }
            if (!isConnected && connectedAddress !== null) {
              setConnectedAddress(null);
              setDecryptionKey(null);
            }
  
            const buttonLabel = isConnected
              ? shortAddress(displayFullAddress(address || ""))
              : isConnecting
              ? "Connecting..."
              : "Connect Wallet";
  
            return (
              <div className="hidden sm:flex items-center gap-3 relative">
                <Button
                  onClick={show}
                  variant="connect"
                  size="sm"
                  aria-label="Connect your wallet"
                >
                  <Wallet className="w-5 h-5 text-black" />
                  {buttonLabel}
                </Button>
              </div>
            );
          }}
        </ConnectKitButton.Custom>
  
        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>
  
      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-card-border">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-smooth ${
                  isActive(item.path)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              <Button variant="connect" size="sm" className="w-full">
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  </header>
  
  
  );
}
