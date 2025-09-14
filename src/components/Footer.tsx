import { Heart, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-card-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center glow-primary">
                <span className="text-white font-bold text-lg">🦄</span>
              </div>
              <span className="text-xl font-bold text-white bg-clip-text text-transparent">
                Unicorn DAO
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Where Privacy Meets Profitability
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-primary transition-smooth">About</a></li>
              <li><a href="/treasury" className="hover:text-primary transition-smooth">Treasury</a></li>
              <li><a href="/eerc" className="hover:text-primary transition-smooth">EERC Service</a></li>
              <li><a href="/bridge" className="hover:text-primary transition-smooth">Bridge</a></li>
              <li><a href="/swap" className="hover:text-primary transition-smooth">Swap</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-smooth">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Whitepaper</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">API</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Support</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <div className="flex space-x-3 mb-4">
              <a href="#" className="p-2 bg-muted/30 rounded-lg hover:bg-primary/20 transition-smooth">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-muted/30 rounded-lg hover:bg-primary/20 transition-smooth">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-muted/30 rounded-lg hover:bg-primary/20 transition-smooth">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-card-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Unicorn DAO. All rights reserved.
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>from India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;