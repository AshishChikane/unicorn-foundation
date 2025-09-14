import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Settings, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Swap = () => {
  const { toast } = useToast();
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState("AVAX");
  const [toToken, setToToken] = useState("USDC");

  // Mock meme tokens data
  const memeTokens = [
    { symbol: "DOGE", name: "Dogecoin", price: "$0.082", change: "+15.4%", trend: "up" },
    { symbol: "SHIB", name: "Shiba Inu", price: "$0.0000089", change: "-2.1%", trend: "down" },
    { symbol: "PEPE", name: "Pepe", price: "$0.0000012", change: "+45.7%", trend: "up" },
    { symbol: "WIF", name: "Dogwifhat", price: "$2.34", change: "+12.8%", trend: "up" },
    { symbol: "BONK", name: "Bonk", price: "$0.000023", change: "-5.3%", trend: "down" },
    { symbol: "FLOKI", name: "Floki", price: "$0.00018", change: "+8.9%", trend: "up" },
  ];

  const tokens = [
    { symbol: "AVAX", name: "Avalanche", balance: "24.67" },
    { symbol: "USDC", name: "USD Coin", balance: "1,247.89" },
    { symbol: "JOE", name: "JOE Token", balance: "156.32" },
    { symbol: "PNG", name: "Pangolin", balance: "89.45" },
  ];

  const handleSwap = () => {
    if (!fromAmount || !toAmount) {
      toast({
        title: "Invalid amounts",
        description: "Please enter valid swap amounts",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Swap initiated",
      description: `Swapping ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
    });
    
    setFromAmount("");
    setToAmount("");
  };

  const swapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Avalanche Token Swap
          </h1>
          <p className="text-xl text-muted-foreground">
            Trade Without Limits
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Swap Interface */}
          <div className="lg:col-span-2">
            <Card className="p-8 glass card-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Swap Tokens</h2>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>

              {/* From Token */}
              <div className="space-y-4">
                <div className="p-6 bg-muted/20 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">From</label>
                    <span className="text-sm text-muted-foreground">
                      Balance: {tokens.find(t => t.symbol === fromToken)?.balance || "0.00"}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="text-2xl font-semibold bg-transparent border-none p-0 h-auto"
                    />
                    <select 
                      className="bg-input border border-card-border rounded-lg px-4 py-2 min-w-[120px]"
                      value={fromToken}
                      onChange={(e) => setFromToken(e.target.value)}
                    >
                      {tokens.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <Button
                    variant="glass"
                    size="icon"
                    className="rounded-full"
                    onClick={swapTokens}
                  >
                    <ArrowUpDown className="w-5 h-5" />
                  </Button>
                </div>

                {/* To Token */}
                <div className="p-6 bg-muted/20 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">To</label>
                    <span className="text-sm text-muted-foreground">
                      Balance: {tokens.find(t => t.symbol === toToken)?.balance || "0.00"}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={toAmount}
                      onChange={(e) => setToAmount(e.target.value)}
                      className="text-2xl font-semibold bg-transparent border-none p-0 h-auto"
                    />
                    <select 
                      className="bg-input border border-card-border rounded-lg px-4 py-2 min-w-[120px]"
                      value={toToken}
                      onChange={(e) => setToToken(e.target.value)}
                    >
                      {tokens.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Swap Details */}
                <div className="p-4 bg-muted/10 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exchange Rate</span>
                    <span>1 {fromToken} = 1.24 {toToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price Impact</span>
                    <span className="text-success">0.12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network Fee</span>
                    <span>~$2.50</span>
                  </div>
                </div>

                <Button 
                  variant="gradient" 
                  className="w-full py-6 text-lg"
                  onClick={handleSwap}
                >
                  Swap Tokens
                </Button>
              </div>
            </Card>
          </div>

          {/* Meme Tokens Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 glass card-border">
              <h3 className="text-xl font-semibold mb-4">Trending Meme Tokens</h3>
              <div className="space-y-3">
                {memeTokens.map((token, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg hover:bg-muted/20 transition-smooth cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">{token.symbol[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{token.symbol}</p>
                        <p className="text-xs text-muted-foreground">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{token.price}</p>
                      <Badge 
                        variant={token.trend === 'up' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {token.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {token.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 glass card-border">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="glass" className="w-full justify-start">
                  View Transaction History
                </Button>
                <Button variant="glass" className="w-full justify-start">
                  Add Custom Token
                </Button>
                <Button variant="glass" className="w-full justify-start">
                  Manage Liquidity
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;