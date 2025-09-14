
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Send, CheckCircle, AlertTriangle } from 'lucide-react';

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIPromptModal: React.FC<AIPromptModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const examplePrompts = [
    "Send 5 AVAX to 0x742d35Cc6d586171832C6E1b035e7E3d35Cb and 3 ETH to 0x8ba1f109551bD432803012645Hac136c5C78",
    "Transfer 100 USDC to Alice at 0x123... and 50 USDT to Bob at 0x456...",
    "Distribute 10 ETH equally among these 3 wallets: 0xabc..., 0xdef..., 0x789..."
  ];

  const processPrompt = async () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock parsed data
    setParsedData({
      recipients: [
        { address: '0x742d35Cc6d586171832C6E1b035e7E3d35Cb', amount: '5', token: 'AVAX' },
        { address: '0x8ba1f109551bD432803012645Hac136c5C78', amount: '3', token: 'ETH' }
      ],
      totalValue: '$2,847.50',
      amlStatus: 'verified'
    });
    
    setIsProcessing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-cyan-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl text-cyan-300">
            <Zap className="w-6 h-6 mr-2" />
            AI-Powered Transfer Assistant
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Describe your transfer in natural language
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Send 5 AVAX to Alice and 3 ETH to Bob..."
              className="min-h-[100px] bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
            />
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">Try these examples:</p>
            <div className="space-y-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="block w-full text-left p-3 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 hover:border-purple-500/50 text-sm text-gray-300 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {parsedData && (
            <div className="bg-slate-800 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-green-300 font-medium">Prompt Parsed Successfully</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-cyan-300 font-medium mb-2">Recipients ({parsedData.recipients.length})</h4>
                  {parsedData.recipients.map((recipient: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-slate-600 last:border-b-0">
                      <span className="font-mono text-sm text-gray-300">{recipient.address.slice(0, 10)}...</span>
                      <span className="text-white font-medium">{recipient.amount} {recipient.token}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-slate-600">
                  <span className="text-gray-300">Total Value:</span>
                  <span className="text-white font-bold">{parsedData.totalValue}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">AML Status:</span>
                  <span className="text-green-400 font-medium flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              onClick={processPrompt}
              disabled={!prompt.trim() || isProcessing}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Parse Transfer
                </>
              )}
            </Button>
            
            {parsedData && (
              <Button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700"
              >
                Execute Transfer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIPromptModal;
