import {createContext, ReactNode, useContext, useMemo} from 'react'
import {type Chain, useAccount, useNetwork, usePublicClient, useWalletClient} from 'wagmi'
import {
  MAINNET_EERC_ADDRESS,
  MAINNET_REGISTRAR_ADDRESS,
  MAINNET_TOKEN_ADDRESS,
  TESTNET_EERC_ADDRESS,
  TESTNET_REGISTRAR_ADDRESS,
  TESTNET_TOKEN_ADDRESS
} from '../constants/contracts'
import {useEERC} from '@avalabs/ac-eerc-sdk'
import {circuitURLs, wasmURLs} from '../config/zkFiles'

interface EERCContextType {
    isConnected: boolean
    chain: Chain | undefined
    network: 'mainnet' | 'testnet'
    contractAddress: `0x${string}`
    tokenAddress: string
    registrarAddress: string
    publicClient?: ReturnType<typeof usePublicClient>
    walletClient?: ReturnType<typeof useWalletClient>['data']
    eerc: any | null
    encryptedBalance: any | null
}

const EERCContext = createContext<EERCContextType>({
    isConnected: false,
    chain: undefined,
    network: 'mainnet',
    contractAddress: '0x0000000000000000000000000000000000000000',
    tokenAddress: '',
    registrarAddress: '',
    eerc: null,
    encryptedBalance: null
})

interface EERCProviderProps {
    children: ReactNode
    network: 'mainnet' | 'testnet'
}

export function EERCProvider({children, network = 'mainnet',selectedToken}: EERCProviderProps) {
    const {isConnected} = useAccount()
    const {chain} = useNetwork()
    const publicClient = usePublicClient()
    const {data: walletClient} = useWalletClient()

    let assignEERCAddress = MAINNET_EERC_ADDRESS;
    let assignRegistrarAddress = MAINNET_REGISTRAR_ADDRESS;
    let assignTokenAddress = MAINNET_TOKEN_ADDRESS;

    if(selectedToken){
        assignEERCAddress = selectedToken.encryptedERC
        assignRegistrarAddress = selectedToken.registrar
        assignTokenAddress = selectedToken.address
    }
    
    const contractAddress = network === 'mainnet' ? assignEERCAddress : assignEERCAddress as `0x${string}`
    const registrarAddress = network === 'mainnet' ? assignRegistrarAddress : assignRegistrarAddress
    const tokenAddress = network === 'mainnet' ? assignTokenAddress : assignTokenAddress

    const eerc = useEERC(
        publicClient,
        walletClient as any,
        contractAddress,
        wasmURLs,
        circuitURLs
    );
    console.log({eerc})
    const encryptedBalance = eerc?.useEncryptedBalance ? eerc.useEncryptedBalance(tokenAddress) : null;
    console.log({encryptedBalance})
    const value = useMemo(() => ({
        isConnected,
        chain,
        network,
        contractAddress,
        tokenAddress,
        registrarAddress,
        publicClient,
        walletClient,
        eerc,
        encryptedBalance
    }), [
        isConnected,
        chain,
        network,
        contractAddress,
        tokenAddress,
        registrarAddress,
        publicClient,
        walletClient,
        eerc,
        encryptedBalance
    ])

    return (
        <EERCContext.Provider value={value}>
            {children}
        </EERCContext.Provider>
    )
}

export function useEERCContext() {
    const context = useContext(EERCContext)
    if (!context) {
        throw new Error('useEERCContext must be used within an EERCProvider')
    }
    return context
}