import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Lock, TrendingUp, Globe, Users } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import { motion } from "framer-motion";

const About = () => {
  const features = [
    {
      icon: Lock,
      title: "Encrypted Transfers",
      description: "EERC service enables completely private token transfers with zero traceability."
    },
    {
      icon: Shield,
      title: "Automated Treasury",
      description: "1% of every liquidity launch goes to treasury, ensuring sustainable ecosystem growth."
    },
    {
      icon: Zap,
      title: "Cross-Chain Bridge",
      description: "Seamlessly swap between chains like Solana to Avalanche with minimal fees."
    },
    {
      icon: TrendingUp,
      title: "Meme Token Hub",
      description: "Trade Avalanche meme tokens with advanced swap functionality and analytics."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Empowering communities worldwide with decentralized financial sovereignty."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Every protocol decision is governed by DAO members, ensuring fairness and inclusivity."
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* HERO SECTION */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute h-full inset-0 bg-gradient-hero opacity-80" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary"
            >
              Where Privacy Meets Profitability 🦄
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
            >
              The Future of Private DeFi — Secure, Scalable, and Self-Sustaining
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button variant="hero" size="lg" className="px-6 py-4 text-base rounded-xl shadow-lg">
                🚀 Explore Platform
              </Button>
              <Button variant="glass" size="lg" className="px-6 py-4 text-base rounded-xl">
                📖 View Documentation
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Revolutionary Features</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Built for privacy, security, and seamless experiences across multiple blockchains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 glass card-border hover:glow-accent transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-accent p-3 rounded-lg glow-accent">
                        <Icon className="w-6 h-6 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
            <div className="space-y-6 text-base text-muted-foreground leading-relaxed text-left">
              <motion.div
                className="p-4 bg-card/60 rounded-xl shadow-lg border-l-4 border-accent"
                whileHover={{ scale: 1.02 }}
              >
                <strong className="text-white">The Problem:</strong> Traditional DeFi lacks both privacy and sustainable
                funding mechanisms. Token launches drain liquidity pools while exposing every transaction to public scrutiny.
              </motion.div>
              <motion.div
                className="p-4 bg-card/60 rounded-xl shadow-lg border-l-4 border-primary"
                whileHover={{ scale: 1.02 }}
              >
                <strong className="text-white">Our Solution:</strong> Every token launch contributes 1% of liquidity to a
                community treasury, powering our EERC (Encrypted ERC) service for untraceable token transfers.
              </motion.div>
              <motion.div
                className="p-4 bg-card/60 rounded-xl shadow-lg border-l-4 border-secondary"
                whileHover={{ scale: 1.02 }}
              >
                <strong className="text-white">What We're Achieving:</strong> A privacy-first DeFi platform where users can
                trade, bridge, and transfer tokens without leaving footprints — while treasury growth sustains innovation.
              </motion.div>
              <motion.div
                className="p-4 bg-card/60 rounded-xl shadow-lg border-l-4 border-accent"
                whileHover={{ scale: 1.02 }}
              >
                <strong className="text-white">The Vision:</strong> Unicorn DAO is a movement toward financial sovereignty
                where privacy is a right, and community wealth grows with every transaction.
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 text-center bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
            Join the Unicorn Movement 🌌
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of the first truly private and self-sustaining DeFi ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-4 text-base rounded-xl shadow-lg">
              Start Trading
            </Button>
            <Button variant="glass" size="lg" className="px-8 py-4 text-base rounded-xl">
              Become a DAO Member
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;