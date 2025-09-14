'use client'

import { useEffect, useState } from 'react'
import { useEERCContext } from '../context/EERCContext'
import { cn, getExplorerUrl } from '../lib/utils'
import { CheckCircle, Zap, AlertTriangle } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const LOCAL_STORAGE_KEY_KEY = 'decryptionKey';

export default function RegisterCard({ decryptionKey, setDecryptionKey, contractAddress, amlScore, setAmlScore }) {
  const { isConnected, chain, eerc } = useEERCContext()
  const [isRegistering, setIsRegistering] = useState(false)
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)

  const isMainnet = chain?.id === 43114
  const savedKey = localStorage.getItem(LOCAL_STORAGE_KEY_KEY)

  useEffect(() => {
    if (savedKey) {
      setDecryptionKey(savedKey)
      setGeneratedKey(savedKey)
    }
  }, [decryptionKey])

  const handleRegister = async () => {
    if (!eerc) return
    setIsRegistering(true)
    setError(null)
    try {
      const result = await eerc.register()
      setTxHash(result.transactionHash)
      toast.success('Registration transaction sent!')

      setTimeout(() => {
        eerc.refetchEercUser()
        toast.success('Registration confirmed!')
      }, 5000)
    } catch (err) {
      console.error('Registration error:', err)
      const msg = err instanceof Error ? err.message : 'An error occurred during registration'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsRegistering(false)
    }
  }

  const handleGenerateKey = async () => {
    if (!eerc) return
    setIsGeneratingKey(true)
    setError(null)
    // setAmlScore(null) // temporarily disabled AML reset
    try {
      const key = await eerc.generateDecryptionKey()
      setGeneratedKey(key)
      localStorage.setItem(LOCAL_STORAGE_KEY_KEY, key)
      toast.success('Unique key generated successfully!')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error occurred during key generation.'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsGeneratingKey(false)
      // setIsCheckingAML(false)
    }
  }

  if (!isConnected) {
    return (
      <>
        <Toaster position="bottom-right" />
        <div className="bg-slate-900/70 border border-slate-700 rounded-3xl p-6 text-white shadow-xl shadow-[#8A2BE2]/20 backdrop-blur-xl max-w-md w-full mx-auto mt-4">
          <h2 className="text-2xl font-bold mb-2 text-center">Registration</h2>
          <p className="text-sm text-slate-400 text-center">Please connect your wallet to proceed.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Toaster position="bottom-right" />

      {(isRegistering || isGeneratingKey) && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="h-14 w-14 sm:h-16 sm:w-16 animate-spin rounded-full border-4 border-t-primary border-b-muted-foreground border-muted/30" />
        </div>
      )}

      {/* Card */}
      <div className="glass border-card-border shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-smooth animate-fade-in-up max-w-lg w-full mx-auto mt-6 rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-foreground">
          Assign Wallet
        </h2>

        <div className="space-y-5">
          {/* Status */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            {eerc?.isRegistered ? (
              <span className="flex items-center text-green-400 font-medium px-3 py-1 rounded-full bg-green-900/30 border border-green-600/40 text-xs">
                <CheckCircle className="w-4 h-4 mr-1" /> Assigned
              </span>
            ) : (
              <span className="flex items-center text-yellow-400 font-medium px-3 py-1 rounded-full bg-yellow-900/30 border border-yellow-600/40 text-xs">
                <Zap className="w-4 h-4 mr-1 animate-pulse" /> Not Assigned
              </span>
            )}
          </div>

          {/* Registered flow */}
          {eerc?.isRegistered && (
            <div className="space-y-4">
              {/* Key status */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Unique Key</span>
                <span
                  className={cn(
                    "font-medium",
                    generatedKey ? "text-green-400" : "text-red-400"
                  )}
                >
                  {generatedKey ? "Set" : "Not Set"}
                </span>
              </div>

              {!generatedKey && (
                <button
                  onClick={handleGenerateKey}
                  disabled={isGeneratingKey}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary-foreground rounded-xl bg-gradient-primary border border-card-border glow-primary hover:scale-[1.03] transition-smooth"
                >
                  {isGeneratingKey ? "Generating..." : "Generate Key"}
                </button>
              )}

              {generatedKey && (
                <>
                  <div className="glass border-card-border p-4 rounded-lg text-xs font-mono text-yellow-300 break-all max-w-full overflow-auto">
                    <p className="mb-1">Your Unique key (save this securely):</p>
                    <p>{generatedKey}</p>
                  </div>

                 
                  <button
                    onClick={handleGenerateKey}
                    disabled={isGeneratingKey}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary-foreground rounded-xl bg-gradient-to-r from-red-500 to-pink-500 border border-card-border hover:scale-[1.03] transition-smooth"
                  >
                    {isGeneratingKey ? "Regenerating..." : "Regenerate Key"}
                  </button>
                </>
              )}
            </div>
          )}

          {!eerc?.isRegistered && (
            <button
              onClick={handleRegister}
              disabled={isRegistering}
              className="w-full flex text-black items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary-foreground rounded-xl bg-gradient-primary border border-card-border glow-primary hover:scale-[1.03] transition-smooth"
            >
              {isRegistering ? "Registering..." : "Register"}
            </button>
          )}

          {txHash && (
            <a
              href={getExplorerUrl(txHash, isMainnet)}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-center mt-2 text-accent hover:text-accent/80 underline break-all"
            >
              View Transaction
            </a>
          )}

          {/* Error */}
          {error && (
            <div className="mt-2 text-xs text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5" />
              <span className="break-words">{error}</span>
            </div>
          )}

          {/* Footer */}
          <p className="mt-6 text-xs text-center text-muted-foreground">
            Secure your crypto by generating unique keys for private transactions.
            Encrypted key pairs ensure your transactions are always secure and untraceable.
          </p>
        </div>
      </div>
    </>
  )
}
