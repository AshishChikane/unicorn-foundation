import { useState, useEffect, useCallback } from 'react';
import { parseEther, isAddress } from 'viem';
import { useEERCContext } from '../context/EERCContext';
import { formatBalance, getExplorerUrl } from '../lib/utils';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'react-hot-toast';
import { AlertTriangle, X } from 'lucide-react';
import { CheckCircle  } from "lucide-react";

export default function TokenTransfer() {
    const { isConnected, chain, eerc, encryptedBalance } = useEERCContext();
    const [amount, setAmount] = useState('');
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
    const [newRecipientAddress, setNewRecipientAddress] = useState('');
    const [isEqual, setIsEqual] = useState(true);
    const [distribution, setDistribution] = useState<number[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const [currentTxHash, setCurrentTxHash] = useState<string | null>(null);
    const [transactionModalVisible, setTransactionModalVisible] = useState(false);
    const [transfersQueue, setTransfersQueue] = useState<{ recipient: string; amount: bigint }[]>([]);
    const [currentTransferIndex, setCurrentTransferIndex] = useState<number>(0);
  
    const isTestnet = chain?.id === 43114;
  
    useEffect(() => {
      if (selectedRecipients.length === 0) {
        setDistribution([]);
        return;
      }
  
      if (isEqual) {
        const totalRecipients = selectedRecipients.length;
        const evenShare = Math.floor(100 / totalRecipients);
        let remainder = 100 - evenShare * totalRecipients;
        const newDistribution = Array(totalRecipients).fill(evenShare);
        for (let i = 0; i < remainder; i++) newDistribution[i]++;
        setDistribution(newDistribution);
      } else {
        if (distribution.length !== selectedRecipients.length) {
          const initialDistribution = Array(selectedRecipients.length).fill(0);
          if (selectedRecipients.length > 0) initialDistribution[0] = 100;
          setDistribution(initialDistribution);
        }
      }
    }, [selectedRecipients, isEqual]);
  
    const totalDistributionPercent = useCallback(
      () => distribution.reduce((acc, val) => acc + val, 0),
      [distribution]
    );
  
    const handleSliderChange = useCallback((index: number, value: number) => {
      setDistribution(prev => {
        const newDistribution = [...prev];
        newDistribution[index] = value;
        let remaining = 100 - value;
        const otherIndices = prev.map((_, i) => i).filter(i => i !== index);
        const currentSum = otherIndices.reduce((sum, i) => sum + (prev[i] || 0), 0);
  
        if (currentSum > 0) {
          otherIndices.forEach(i => {
            const proportion = (prev[i] || 0) / currentSum;
            newDistribution[i] = Math.max(0, Math.round(proportion * remaining));
          });
        } else {
          const equal = Math.floor(remaining / otherIndices.length);
          otherIndices.forEach(i => (newDistribution[i] = equal));
          for (let i = 0; i < remaining - equal * otherIndices.length; i++) {
            newDistribution[otherIndices[i]]++;
          }
        }
  
        const currentTotal = newDistribution.reduce((a, b) => a + b, 0);
        const adjust = 100 - currentTotal;
        if (adjust !== 0) {
          const adjustIndex = index === 0 && newDistribution.length > 1 ? 1 : 0;
          newDistribution[adjustIndex] = Math.max(0, newDistribution[adjustIndex] + adjust);
        }
  
        return newDistribution;
      });
    }, []);
  
    const transferAmount = async (recipient: string, amount: bigint): Promise<string> => {
      const result = await encryptedBalance.privateTransfer(recipient, amount);
      return result.transactionHash;
    };
  
    const handleTransfer = async () => {
      if (!isConnected) return toast.error('Wallet not connected.');
      if (!eerc || !encryptedBalance) return toast.error('EERC context not fully loaded.');
      if (selectedRecipients.length === 0) return toast.error('Add at least one recipient.');
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return toast.error('Invalid amount.');
  
      const amountInWei = parseEther(amount);
      if (amountInWei > (encryptedBalance?.decryptedBalance || 0n)) {
        return toast.error('Insufficient balance.');
      }
  
      const currentTotalDistribution = totalDistributionPercent();
      if (currentTotalDistribution !== 100 || distribution.some(p => p < 0)) {
        return toast.error(`Distribution must sum to 100%. Current: ${currentTotalDistribution}%`);
      }
  
      const transfers = selectedRecipients.map((recipient, idx) => ({
        recipient,
        amount: (amountInWei * BigInt(distribution[idx])) / 100n
      })).filter(tx => tx.amount > 0n);
  
      if (transfers.length === 0) return toast.error("All calculated amounts are zero.");
  
      setIsProcessing(true);
      setError(null);
      setTransfersQueue(transfers);
      setCurrentTransferIndex(0);
  
      await executeTransfer(transfers[0]);
    };
  
    const executeTransfer = async (transfer: { recipient: string; amount: bigint }) => {
      try {
        console.log('demo',transfer.recipient,transfer.amount)
        const txHash = await transferAmount(transfer.recipient, transfer.amount);
        console.log({txHash})
        setCurrentTxHash(txHash);
        await new Promise(resolve => setTimeout(resolve, 10000));
        setTransactionModalVisible(true);
        // setIsProcessing(false);
      } catch (err) {
        // console.error("Transfer failed:", err);
        // toast.error(`Transfer to ${transfer.recipient.slice(0, 6)}... failed.`);
        setIsProcessing(false);
        // proceedToNextTransfer(); // Skip on error
      }
    };
  
    const proceedToNextTransfer = async () => {
        setTransactionModalVisible(false);
        const nextIndex = currentTransferIndex + 1;
      
        if (nextIndex < transfersQueue.length) {
          setCurrentTransferIndex(nextIndex);
          
          // Wait for 15 seconds before executing the transfer
          await new Promise(resolve => setTimeout(resolve, 15000));
          
          await executeTransfer(transfersQueue[nextIndex]);
        } else {
          toast.success('All transfers completed.');
          setIsProcessing(false);
          setAmount('');
          setSelectedRecipients([]);
          setIsEqual(true);
          encryptedBalance.refetchBalance();
          setTransfersQueue([]);
        }
    };
  
    const addRecipient = () => {
      const addr = newRecipientAddress.trim();
      if (!addr) return toast.error('Empty address.');
      if (!isAddress(addr)) return toast.error('Invalid address.');
      if (selectedRecipients.includes(addr)) return toast.error('Already added.');
  
      setSelectedRecipients(prev => [...prev, addr]);
      setNewRecipientAddress('');
      toast.success('Recipient added!');
    };
  
    const removeRecipient = (address: string) => {
      setSelectedRecipients(prev => prev.filter(a => a !== address));
      toast.success('Recipient removed.');
    };
  
    const handleNewRecipientKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addRecipient();
      }
    };
  
  return (
    <>
    <Toaster position="bottom-right" />
    {isProcessing && (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="h-16 w-16 animate-spin rounded-full border-t-8 border-b-8 border-white border-t-orange-500" />
    </div>
    )}


    {transactionModalVisible && currentTxHash && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg">
        <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-black/40 p-12 text-center text-white shadow-xl animate-fade-in-up">
          {/* Icon container */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-2xl border border-orange-600/50 bg-gradient-to-br from-orange-900 via-slate-900 to-slate-950 p-4 shadow-lg shadow-orange-500/30">
            <CheckCircle className="h-12 w-12 text-orange-400" />
          </div>

          {/* Title */}
          <h2 className="mt-6 text-2xl font-bold">Transaction Complete</h2>

          {/* Explorer link */}
          <p className="mt-2 text-sm text-slate-300">
            Verify on Explorer:{" "}
            <a
              href={getExplorerUrl(currentTxHash, chain?.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-orange-400 hover:text-orange-300 break-all"
            >
              {currentTxHash.slice(0, 10)}...
            </a>
          </p>

          {/* Confirm button */}
          <Button
            onClick={proceedToNextTransfer}
            className="mt-6 w-full rounded-xl bg-gradient-to-br from-orange-900 via-slate-900 to-slate-950 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 hover:scale-[1.02] hover:shadow-orange-500/40 transition"
          >
            Confirm
          </Button>
        </div>
      </div>
    )}


  <div className="glass border border-slate-700/60 shadow-lg shadow-cyan-900/20 hover:shadow-cyan-900/40 transition-all duration-300 max-w-lg mx-auto mt-8 rounded-2xl p-8 backdrop-blur-md">
    <h2 className="mb-6 text-center text-3xl font-extrabold text-white tracking-tight">
      Confidential Transfer
    </h2>

    <div className="mb-6 rounded-xl bg-slate-800/60 p-4 flex justify-between items-center">
      <p className="text-sm text-white">Available Balance</p>
      <p className="font-semibold text-white">
        {encryptedBalance ? `${formatBalance(encryptedBalance.decryptedBalance)} Tokens` : "0 Tokens"}
      </p>
    </div>

    <div className="mb-6">
      <label htmlFor="new-recipient" className="mb-2 block text-sm font-medium text-slate-300">
        Add Recipient
      </label>
      <div className="flex gap-2">
        <input
          id="new-recipient"
          type="text"
          placeholder="0xABC...123"
          className="block w-full rounded-xl border border-card-border bg-background/80 px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          value={newRecipientAddress}
          onChange={(e) => setNewRecipientAddress(e.target.value)}
          onKeyDown={handleNewRecipientKeyDown}
        />
        <button
          onClick={addRecipient}
          className="text-black flex items-center justify-center gap-2 px-5 py-1 text-sm font-semibold text-primary-foreground rounded-xl bg-gradient-secondary hover:scale-[1.03] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"        >
          Add
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 rounded-xl border border-slate-700 bg-slate-800/70 p-3 min-h-[50px]">
  {selectedRecipients.length === 0 ? (
    <p className="text-sm italic text-slate-500">No recipients yet.</p>
  ) : (
    selectedRecipients.map((addr) => (
      <span
        key={addr}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-secondary text-black px-3 py-1 text-sm font-medium shadow-sm"
      >
        {`${addr.slice(0, 6)}...${addr.slice(-4)}`}
        <button
          onClick={() => removeRecipient(addr)}
          className="ml-1 rounded-full p-1 hover:bg-black hover:text-white transition"
        >
          <X size={14} />
        </button>
      </span>
    ))
  )}
</div>

    </div>
    <div className="relative mb-6">
      <input
        type="text"
        inputMode="decimal"
        placeholder="Enter amount"
        className="block w-full rounded-xl border border-card-border bg-background/80 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
      />
      <button
        onClick={() => encryptedBalance && setAmount(formatBalance(encryptedBalance.decryptedBalance))}
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-gradient-primary glow-primary px-3 py-1 text-xs font-semibold text-black shadow hover:bg-gradient-primary glow-primary transition"
      >
        Max
      </button>
    </div>

    {selectedRecipients.length > 0 && (
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <label className="text-sm text-slate-300">Distribution</label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={isEqual}
              onChange={() => setIsEqual(!isEqual)}
              className="h-4 w-4 text-orange-500"
            />
            <span className="text-sm text-slate-300">Equal</span>
          </label>
        </div>

        {!isEqual &&
          distribution.length === selectedRecipients.length &&
          distribution.map((percent, i) => (
            <div key={selectedRecipients[i]} className="mb-4">
              <label className="mb-1 block text-sm text-slate-400">
                {`${selectedRecipients[i].slice(0, 6)}...${selectedRecipients[i].slice(-4)}`}  
                – {percent}% (~{((Number(amount) || 0) * percent / 100).toFixed(6)} tokens)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={percent}
                onChange={(e) => handleSliderChange(i, parseInt(e.target.value))}
                className="w-full accent-orange-500"
                disabled={selectedRecipients.length === 1}
              />
            </div>
          ))}

        {isEqual &&
          selectedRecipients.map((addr, i) => (
            <p key={addr} className="text-sm text-slate-400">
              {`${addr.slice(0, 6)}...${addr.slice(-4)}`} → {distribution[i]}% (~
              {((Number(amount) || 0) * distribution[i] / 100).toFixed(6)} tokens)
            </p>
          ))}
      </div>
    )}

    <button
      onClick={handleTransfer}
      disabled={
        isProcessing ||
        !amount ||
        Number(amount) <= 0 ||
        selectedRecipients.length === 0 ||
        totalDistributionPercent() !== 100
      }
      className="w-full text-black flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary-foreground rounded-xl bg-gradient-primary glow-primary hover:scale-[1.03] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
      >
      {isProcessing ? "Processing..." : "Transfer"}
    </button>

    {error && (
      <p className="mt-4 flex items-center justify-center gap-2 text-sm text-red-400">
        <AlertTriangle size={16} /> {error}
      </p>
    )}

    {isTestnet && (
      <p className="mt-4 text-center text-xs text-slate-400">
        You are connected to the testnet.
      </p>
    )}
  </div>

  </>
  );
}