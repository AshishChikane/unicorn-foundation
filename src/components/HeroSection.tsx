import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Users, Eye, ArrowRight } from 'lucide-react';
import { motion } from "framer-motion";

interface HeroSectionProps {
  onTransferClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onTransferClick }) => {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
        <div className="absolute inset-0 bg-black opacity-80" />
      </div>
  
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm tracking-widest uppercase text-accent mb-4"
        >
          The Future of Private DeFi
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary"
        >
          Where Privacy Meets Profitability 🦄
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto"
        >
          Secure, scalable, and self-sustaining. Unlock the next era of decentralized finance.
        </motion.p>
  
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button variant="hero" size="lg" className="px-8 py-4 text-lg rounded-2xl shadow-xl">
            🚀 Connect Wallet
          </Button>
          {/* <Button variant="glass" size="lg" className="px-8 py-4 text-lg rounded-2xl">
            📖 View Documentation
          </Button> */}
        </motion.div>
      </div>
    </section>

  );
};

export default HeroSection;
