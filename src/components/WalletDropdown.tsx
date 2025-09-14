import React, { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Wallet, LogOut, DollarSign } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

interface WalletDropdownProps {
  walletAddresses: string[]
  selectedAddress: string
  onSelectAddress: (address: string) => void
  onGetBalances?: () => void
  onDisconnect: () => void
}

const WalletDropdown: React.FC<WalletDropdownProps> = ({
  walletAddresses,
  selectedAddress,
  onSelectAddress,
  onGetBalances,
  onDisconnect,
}) => {
  const [open, setOpen] = useState(false)

  const balances = {
    AVAX: "1.234",
    KET: "567.89",
    ARENA: "12345",
  }

  const handleGetBalanceClick = () => {
    setOpen(true)
    if (onGetBalances) onGetBalances()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="text-white border border-[#8A2BE2] rounded-full px-6 py-5 text-sm flex items-center hover:bg-[#8A2BE2]/10 hover:border-purple-400 hover:text-white hover:scale-105 hover:shadow-[#8A2BE2]/20 transition-transform"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {selectedAddress}
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-slate-900 border border-slate-700/50 min-w-[12rem] p-1 rounded-2xl shadow-lg">
          <DropdownMenuItem
            onClick={handleGetBalanceClick}
            className="text-sm cursor-pointer hover:bg-[#8A2BE2]/20 rounded-sm px-2 py-1.5 text-white"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Get Balance
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 bg-slate-700/50" />

          <DropdownMenuItem
            onClick={onDisconnect}
            className="text-sm cursor-pointer hover:bg-red-500/20 rounded-sm px-2 py-1.5 text-red-400"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md bg-slate-900/80 backdrop-blur-xl text-white border-2 border-gray-700 rounded-3xl transition-all duration-300 shadow-2xl shadow-[#8A2BE2]/30">
        <DialogHeader>
        <DialogTitle className="text-white text-3xl font-bold mb-4 text-center bg-gradient-to-r from-cyan-400 via-[#8A2BE2] to-purple-500 bg-clip-text text-transparent">
            Wallet Balance
          </DialogTitle>
            <DialogClose />
        </DialogHeader>
        <DialogDescription>
            <ul className="space-y-4 mt-4">
            <li className="flex items-center space-x-3">
                <span className="text-2xl">🦊</span>  
                <div>
                <p className="font-semibold text-lg">AVAX</p>
                <p className="text-sm text-gray-300">{balances.AVAX} AVAX</p>
                </div>
            </li>

            <li className="flex items-center space-x-3">
                <span className="text-2xl">💎</span> 
                <div>
                <p className="font-semibold text-lg">KET</p>
                <p className="text-sm text-gray-300">{balances.KET} KET</p>
                </div>
            </li>

            <li className="flex items-center space-x-3">
                <span className="text-2xl">⚔️</span>  
                <div>
                <p className="font-semibold text-lg">ARENA</p>
                <p className="text-sm text-gray-300">{balances.ARENA} ARENA</p>
                </div>
            </li>
            </ul>
        </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default WalletDropdown
