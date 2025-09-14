import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, TrendingUp, Lock } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import TextType from '@/components/TextType';

const Index = () => {
  const features = [
    {
      icon: Lock,
      title: "EERC Service",
      description: "Send tokens with complete privacy and zero traceability",
      link: "/eerc"
    },
    {
      icon: Shield,
      title: "Treasury Management",
      description: "Automated treasury from 1% of every liquidity launch",
      link: "/treasury"
    },
    {
      icon: Zap,
      title: "Cross-Chain Bridge",
      description: "Bridge tokens between Solana, Avalanche, and more",
      link: "/bridge"
    },
    {
      icon: TrendingUp,
      title: "Token Swap",
      description: "Trade Avalanche meme tokens with advanced features",
      link: "/swap"
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <h3 className="text-xl md:text-6xl font-bold text-white mb-8 bg-clip-text text-transparent leading-tight">
            <TextType 
              text={[
                "Empowering privacy-first finance",
                "Cross-chain freedom with zero compromise",
                "The future of treasury management",
                "Where security fuels innovation",
                "Redefining digital privacy and profitability"
              ]}
              typingSpeed={85}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
            />
          </h3>
            <p className="text-2xl md:text-3xl text-muted-foreground mb-8 leading-relaxed">
              Where Privacy Meets Profitability 🦄
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Revolutionary platform combining encrypted token transfers, automated treasury management, 
              and cross-chain functionality. Built for privacy, powered by innovation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/about">
                <Button variant="hero" size="lg" className="px-8 py-4 text-lg">
                  Explore Platform
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/treasury">
                <Button variant="connect" size="lg" className="px-8 py-4 text-lg">
                  View Treasury
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">$2.8M+</div>
                <div className="text-muted-foreground">Treasury Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">100%</div>
                <div className="text-muted-foreground">Private Transfers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">4</div>
                <div className="text-muted-foreground">Supported Chains</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for private, secure, and efficient DeFi operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-8 glass card-border hover:glow-accent transition-smooth group">
                  <Link to={feature.link} className="block">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-accent p-4 rounded-lg glow-accent group-hover:scale-110 transition-smooth">
                        <Icon className="w-8 h-8 text-accent-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {feature.description}
                        </p>
                        <div className="flex items-center text-primary group-hover:translate-x-2 transition-smooth">
                          <span className="font-medium">Learn More</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience Private DeFi?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join the revolution in decentralized finance with our encrypted transfer 
              service and community-driven treasury.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/eerc">
                <Button variant="hero" size="lg" className="px-8 py-4">
                  Start Private Transfer
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="glass" size="lg" className="px-8 py-4">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
