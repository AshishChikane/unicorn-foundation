import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, CheckCircle, AlertTriangle, Zap } from 'lucide-react';

interface Recipient {
  id: string;
  address: string;
  amount: string;
  token: string;
  amlStatus?: 'pending' | 'verified' | 'flagged';
}

interface MultiTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MultiTransferModal: React.FC<MultiTransferModalProps> = ({ isOpen, onClose }) => {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', address: '', amount: '', token: 'AVAX', amlStatus: 'pending' } 
  ]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const supportedTokens = ['AVAX', 'ETH', 'USDC', 'USDT', 'BTC'];

  const addRecipient = () => {
    setRecipients(prev => [
      ...prev,
      { id: Date.now().toString(), address: '', amount: '', token: 'AVAX', amlStatus: 'pending' } 
    ]);
  };

  const removeRecipient = (id: string) => {
    if (recipients.length > 1) {
      setRecipients(prev => prev.filter(r => r.id !== id));
      setIsVerified(false); 
    }
  };

  const updateRecipient = (id: string, field: keyof Recipient, value: string) => {
    setRecipients(prev =>
      prev.map(r => (r.id === id ? { ...r, [field]: value } : r))
    );
    setIsVerified(false);
    setRecipients(prev => prev.map(r => (r.id === id ? { ...r, amlStatus: 'pending' } : r)));
  };

  const verifyTransfers = async () => {
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const updated = recipients.map(r => ({
      ...r,
      amlStatus: Math.random() > 0.85 ? 'flagged' : 'verified' 
    }));
    setRecipients(updated);
    setIsVerified(true);
    setIsVerifying(false);
  };

  const allVerified = recipients.every(r => r.amlStatus === 'verified');
  const hasValidData = recipients.every(r => r.address && r.amount && r.token);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-slate-900/80 backdrop-blur-xl text-white border-2 border-gray-700 rounded-3xl transition-all duration-300 shadow-2xl shadow-[#8A2BE2]/30">
        <DialogHeader>
          <DialogTitle className="text-white text-3xl font-bold mb-4 text-center bg-gradient-to-r from-cyan-400 via-[#8A2BE2] to-purple-500 bg-clip-text text-transparent">
            Multi-Token Transfer
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-end mb-6">
          <Button
            onClick={addRecipient}
            size="sm"
            className="px-6 py-5 text-base font-semibold bg-gradient-to-r from-cyan-500 to-[#8A2BE2] hover:from-cyan-600 hover:to-purple-600 text-white rounded-full shadow-xl shadow-[#8A2BE2]/25 hover:shadow-[#8A2BE2]/40 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 border border-[#8A2BE2]"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Recipient
          </Button>
        </div>

        <div className="max-h-[45vh] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-[#8A2BE2]/60 scrollbar-track-transparent">
          {recipients.map((recipient, index) => (
            <div
              key={recipient.id}
              className="bg-slate-800/50 backdrop-blur-md p-5 rounded-xl border border-slate-700/40 transition-all duration-300 shadow-lg hover:shadow-[#8A2BE2]/10 group"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-[#8A2BE2] flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <h4 className="text-base font-semibold text-white">
                    Recipient #{index + 1}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  {recipient.amlStatus === 'verified' && (
                    <span className="flex items-center text-green-400 text-xs font-medium px-2.5 py-1 rounded-full bg-green-900/20 border border-green-500/30">
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Verified
                    </span>
                  )}
                  {recipient.amlStatus === 'flagged' && (
                    <span className="flex items-center text-red-400 text-xs font-medium px-2.5 py-1 rounded-full bg-red-900/20 border border-red-500/30">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> Flagged
                    </span>
                  )}
                  {recipient.amlStatus === 'pending' && (
                    <span className="flex items-center text-yellow-400 text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-900/20 border border-yellow-500/30">
                      <Zap className="w-3.5 h-3.5 mr-1.5 animate-pulse" /> Pending
                    </span>
                  )}
                  {recipients.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeRecipient(recipient.id)}
                      className="h-8 w-8 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200 rounded-lg"
                      title="Remove Recipient"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor={`address-${recipient.id}`} className="text-xs font-medium text-gray-400 mb-1.5 block">
                    Recipient Address
                  </label>
                  <Input
                    id={`address-${recipient.id}`}
                    placeholder="0x..."
                    value={recipient.address}
                    onChange={(e) => updateRecipient(recipient.id, 'address', e.target.value)}
                    className="h-10 bg-slate-700/30 border-slate-600/50 text-white font-mono text-sm rounded-lg focus:ring-1 focus:ring-[#8A2BE2] focus:border-[#8A2BE2] transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`amount-${recipient.id}`} className="text-xs font-medium text-gray-400 mb-1.5 block">
                      Amount
                    </label>
                    <Input
                      id={`amount-${recipient.id}`}
                      type="number"
                      placeholder="e.g. 100"
                      value={recipient.amount}
                      onChange={(e) => updateRecipient(recipient.id, 'amount', e.target.value)}
                      className="h-10 bg-slate-700/30 border-slate-600/50 text-white text-sm rounded-lg focus:ring-1 focus:ring-[#8A2BE2] focus:border-[#8A2BE2] transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor={`token-${recipient.id}`} className="text-xs font-medium text-gray-400 mb-1.5 block">
                      Token
                    </label>
                    <Select
                      value={recipient.token}
                      onValueChange={(value) => updateRecipient(recipient.id, 'token', value)}
                    >
                      <SelectTrigger 
                        id={`token-${recipient.id}`} 
                        className="h-10 bg-slate-700/30 border-slate-600/50 text-white text-sm w-full rounded-lg focus:ring-1 focus:ring-[#8A2BE2] focus:border-[#8A2BE2] transition-all duration-200"
                      >
                        <SelectValue placeholder="Select Token" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800/95 backdrop-blur-md text-white border-slate-700/50 rounded-lg shadow-xl">
                        {supportedTokens.map(token => (
                          <SelectItem 
                            key={token} 
                            value={token} 
                            className="text-sm hover:bg-slate-700/50 focus:bg-slate-700/50 data-[state=checked]:bg-slate-700/50 data-[highlighted]:bg-slate-700/50"
                          >
                            {token}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {recipient.amlStatus === 'flagged' && (
                  <div className="flex items-center gap-2 text-red-400 text-xs bg-red-900/10 border border-red-500/20 rounded-lg p-2.5">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>AML Risk Detected – Review Required</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex mt-8">
          {!isVerified ? (
            <Button
              onClick={verifyTransfers}
              disabled={!hasValidData || isVerifying}
              className="flex-1 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-[#8A2BE2] hover:from-cyan-600 hover:to-purple-600 text-white rounded-full shadow-xl shadow-[#8A2BE2]/25 hover:shadow-[#8A2BE2]/40 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 border border-[#8A2BE2]"
            >
              {isVerifying ? 'Verifying...' : 'Verify AML Status'}
            </Button>
          ) : (
            <Button
              disabled={!allVerified}
              className="flex-1 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-full shadow-xl shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 border border-purple-500"
            >
              {allVerified ? 'Execute Transfer' : 'Fix AML Issues'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiTransferModal;
