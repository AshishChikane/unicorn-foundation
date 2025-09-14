import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import ThreeBackground from "./components/ThreeBackground";
import About from "./pages/About";
import Treasury from "./pages/Treasury";
import Swap from "./pages/Swap";
import EERC from "./pages/EERC";
import Bridge from "./pages/Bridge";
import NotFound from "./pages/NotFound";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
const queryClient = new QueryClient();

type MenuItem = 'assignWallet' | 'bridge' | 'transfer';

const LOCAL_STORAGE_MENU_KEY = 'activeMenuItem';
const LOCAL_STORAGE_KEY_KEY = 'decryptionKey';

const AppLayout = ({ children }) => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>('testnet');
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [decryptionKey, setDecryptionKeyState] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItem>('assignWallet');
  const [amlScore, setAmlScore] = useState<number | null>(null)

  useEffect(() => {
    const savedMenu = localStorage.getItem(LOCAL_STORAGE_MENU_KEY) as MenuItem | null;
    if (savedMenu && ['assignWallet', 'bridge', 'transfer'].includes(savedMenu)) {
      setActiveMenuItem(savedMenu);
    } else {
      setActiveMenuItem('assignWallet'); // Ensure default
    }
  
    const savedKey = localStorage.getItem(LOCAL_STORAGE_KEY_KEY);
    if (savedKey) {
      setDecryptionKeyState(savedKey);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_MENU_KEY, activeMenuItem);
  }, [activeMenuItem]);


  const setDecryptionKey = (key: string | null) => {
    if (key) {
      localStorage.setItem(LOCAL_STORAGE_KEY_KEY, key);
      setDecryptionKeyState(key);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_KEY);
      setDecryptionKeyState('');
    }
  };

  const handleMenuChange = (menu) => {
    if ((menu === 'bridge' || menu === 'transfer') && !decryptionKey) {
      toast.error('Please register and generate a unique key before accessing this section.');
      return;
    }
    setActiveMenuItem(menu);
  };

  useEffect(() => {
    if (connectedAddress) {
      setActiveMenuItem('assignWallet');
    }
  }, [connectedAddress]);
  


  const location = useLocation();

  // Show Header except on "/eerc"
  const showHeader = location.pathname !== "/eerc";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* <ThreeBackground /> */}

      {showHeader && <Header
              network={network}
              connectedAddress={connectedAddress}
              setConnectedAddress={setConnectedAddress}
              setDecryptionKey={setDecryptionKey}
            />
        }

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/eerc" element={<Index />} />  
            <Route path="/about" element={<About />} />
            <Route path="/" element={<About />} />
            <Route path="/treasury" element={<Treasury />} />
            <Route path="/swap" element={<Swap />} />
            <Route path="/eerc-page" element={<EERC />} /> 
            <Route path="/bridge" element={<Bridge />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
