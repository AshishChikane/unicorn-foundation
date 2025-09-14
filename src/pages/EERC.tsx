import { useEffect, useState } from 'react';
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

type MenuItem = 'assignWallet' | 'bridge' | 'transfer';

const LOCAL_STORAGE_MENU_KEY = 'activeMenuItem';
const LOCAL_STORAGE_KEY_KEY = 'decryptionKey';
const LOCAL_STORAGE_ADDRESS_KEY = "connectedAddress";

const EERC = () => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>('testnet');
  // const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [decryptionKey, setDecryptionKeyState] = useState('');
  const decryptionKeyLocal = localStorage.getItem(LOCAL_STORAGE_KEY_KEY)
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItem>('assignWallet');
  const [amlScore, setAmlScore] = useState<number | null>(null)
  const LOCAL_STORAGE_SELECTED_USER_TOKEN = 'selectedToken'
  const selectedToken = localStorage.getItem(LOCAL_STORAGE_SELECTED_USER_TOKEN)
  const connectedAddress = localStorage.getItem(LOCAL_STORAGE_ADDRESS_KEY) 

  useEffect(() => {
    const savedMenu = localStorage.getItem(LOCAL_STORAGE_MENU_KEY) as MenuItem | null;
    if (savedMenu && ['assignWallet', 'bridge', 'transfer'].includes(savedMenu)) {
      setActiveMenuItem(savedMenu);
    } else {
      setActiveMenuItem('assignWallet'); 
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

  const handleMenuChange = (menu: MenuItem) => {
    // if ((menu === 'bridge' || menu === 'transfer') && !decryptionKeyLocal) {
    //   toast.error('Please register and generate a unique key before accessing this section.');
    //   return;
    // }
    setActiveMenuItem(menu);
  };

  useEffect(() => {
    if (connectedAddress) {
      setActiveMenuItem('assignWallet');
    }
  }, [connectedAddress]);
  

  return (
    <div className="min-h-screen flex flex-col text-white bg-black">
      <div className="flex flex-col min-h-screen relative z-10">
        {/* <Header
          network={network}
          connectedAddress={connectedAddress}
          setConnectedAddress={setConnectedAddress}
          setDecryptionKey={setDecryptionKey}
          setSelectedToken={setSelectedToken}
        /> */}
        {connectedAddress ? (
          <EERCProvider network={network} selectedToken={selectedToken}>
            <motion.main
              className="flex-1 container mx-auto px-4 py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="mb-8 flex justify-end">
                <NetworkToggle
                  network={network}
                  onToggle={() => setNetwork(network === 'mainnet' ? 'testnet' : 'mainnet')}
                />
              </div>
              <Menu activeMenu={activeMenuItem} onChange={handleMenuChange} />
              {activeMenuItem === 'assignWallet' && (
                <Register
                  decryptionKey={decryptionKey}
                  setDecryptionKey={setDecryptionKey}
                  contractAddress={connectedAddress}
                  setAmlScore={setAmlScore}
                  amlScore={amlScore}
                />               
              )}
              {activeMenuItem === 'bridge' && (
                <div className="">
                  <TokenOperations />
                </div>
              )}
              {activeMenuItem === 'transfer' && (
                <div className="">
                  <TokenTransfer />
                </div>
              )}
            </motion.main>
          </EERCProvider>
        ) : (
          <div className="min-h-screen text-white overflow-hidden">
            {/* <div className="flex flex-col min-h-screen relative z-10">
              <div className="flex-grow flex items-center justify-center">
                <HeroSection
                  onTransferClick={() => setIsTransferModalOpen(true)}
                  onPromptClick={() => setIsPromptModalOpen(true)}
                />
              </div>
            </div> */}

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

export default EERC;
