import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import MultiTransferModal from '@/components/MultiTransferModal';
import AIPromptModal from '@/components/AIPromptModal';
import Header from '../components/Header';
import NetworkToggle from '../components/NetworkToggle';
import Register from '../components/Register';
import TokenOperations from '../components/TokenOperations';
import TokenTransfer from '../components/TokenTransfer';
import { EERCProvider } from '../context/EERCContext';
import { motion } from 'framer-motion';
import Menu from '../components/Menu';
import { toast } from 'react-hot-toast';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';

type MenuItem = 'assignWallet' | 'bridge' | 'transfer';
type Token = {
  address: string;
  name: string;
  symbol: string;
  balance: string;
  registrar: string,
  encryptedERC: string

};

const LOCAL_STORAGE_MENU_KEY = 'activeMenuItem';
const LOCAL_STORAGE_KEY_KEY = 'decryptionKey';

const Index = () => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>('testnet');
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [decryptionKey, setDecryptionKeyState] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItem>('assignWallet');
  const [amlScore, setAmlScore] = useState<number | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  useEffect(() => {
    const savedMenu = localStorage.getItem(LOCAL_STORAGE_MENU_KEY) as MenuItem | null;
    if (savedMenu && ['assignWallet', 'bridge', 'transfer'].includes(savedMenu)) {
      setActiveMenuItem(savedMenu);
    }

    const savedKey = localStorage.getItem(LOCAL_STORAGE_KEY_KEY);
    if (savedKey) {
      setDecryptionKeyState(savedKey);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_MENU_KEY, activeMenuItem);
  }, [activeMenuItem]);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await fetch(
          'https://5d6f6842c900.ngrok-free.app/v1/arena-token/treasury-tokens',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          }
        );
        
        const data = await res.json();

        if (data?.isSuccess && data?.result?.holdings) {
          const mappedTokens: Token[] = data.result.holdings.map((t: any) => ({
            address: t.token_contract_address,
            name: t.token_name,
            symbol: t.token_symbol,
            balance: t.balance,
            logo: t.photo_url,
            registrar: t.registrar,
            encryptedERC:t.encryptedERC
          }));
  
          setTokens(mappedTokens);
  
          if (mappedTokens.length > 0) {
            setSelectedToken(mappedTokens[0]); 
          }
        } else {
          toast.error('No tokens found');
        }
      } catch (err) {
        console.error('Error fetching tokens:', err);
        toast.error('Failed to load tokens');
      }
    };
  
    if (connectedAddress) fetchTokens();
  }, [connectedAddress]);

  const handleTokenChange = (address: string) => {
    const token = tokens.find((t) => t.address === address);
    if (token) {
      setSelectedToken(token);
      setDecryptionKey("");
      setAmlScore(null);
      setActiveMenuItem('assignWallet')
    }
  };

  const setDecryptionKey = (key: string | null) => {
    if (key) {
      localStorage.setItem(LOCAL_STORAGE_KEY_KEY, key);
      setDecryptionKeyState(key);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_KEY);
      setDecryptionKeyState('');
    }
  };

  const handleMenuChange = (menu: MenuItem) => {
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

  return (
    <div className="min-h-screen flex flex-col text-white">
    <div className="flex flex-col min-h-screen relative z-10">
      <Header
        network={network}
        connectedAddress={connectedAddress}
        setConnectedAddress={setConnectedAddress}
        setDecryptionKey={setDecryptionKey}
      />

      {connectedAddress ? (
        <EERCProvider network={network} selectedToken={selectedToken}>
          <motion.main
            className="flex-1 container mx-auto px-4 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Toolbar row */}
            <div className="flex justify-end items-center mt-12 gap-4">
              {tokens.length > 0 && (
                <Select
                  onValueChange={(val) => handleTokenChange(val)}
                  value={selectedToken?.address}
                >
                  <SelectTrigger className="w-[260px] bg-slate-800 border border-slate-600">
                    <SelectValue placeholder="Select a token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.address} value={token.address}>
                        <div className="flex text-nowrap items-center gap-2">
                          <img
                            src={token.logo}
                            alt={token.symbol}
                            className="w-5 h-5 rounded-full"
                          />
                          <span>
                            {token.name} ({token.symbol})
                          </span>
                          {/* <span className="ml-auto text-xs text-gray-100">
                            {token.balance}
                          </span> */}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <Menu
              activeMenu={activeMenuItem}
              onChange={setActiveMenuItem}
            />

            {activeMenuItem === "assignWallet" && (
              <div className="min-h-96 flex items-center justify-center px-4">
                <Register
                  decryptionKey={decryptionKey}
                  setDecryptionKey={setDecryptionKey}
                  contractAddress={connectedAddress}
                  setAmlScore={setAmlScore}
                  amlScore={amlScore}
                />
              </div>
            )}

            {activeMenuItem === "bridge" && (
              <div className="space-y-8">
                <TokenOperations />
              </div>
            )}

            {activeMenuItem === "transfer" && (
              <div className="space-y-8">
                <TokenTransfer />
              </div>
            )}
          </motion.main>
        </EERCProvider>
      ) : (
        <div className="min-h-screen text-white overflow-hidden">
          <div className="flex flex-col min-h-screen relative z-10">
            <div className="flex-grow flex items-center justify-center">
              <HeroSection
                onTransferClick={() => setIsTransferModalOpen(true)}
                onPromptClick={() => setIsPromptModalOpen(true)}
              />
            </div>
          </div>

          <MultiTransferModal
            isOpen={isTransferModalOpen}
            onClose={() => setIsTransferModalOpen(false)}
          />
          <AIPromptModal
            isOpen={isPromptModalOpen}
            onClose={() => setIsPromptModalOpen(false)}
          />
        </div>
      )}
    </div>
  </div>
  );
};

export default Index;
