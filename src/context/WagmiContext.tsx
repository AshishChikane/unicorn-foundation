// import {createConfig, WagmiConfig as WagmiConfigProvider} from 'wagmi'
// import {ConnectKitProvider, getDefaultConfig} from 'connectkit'
// import {avalanche, avalancheFuji} from 'wagmi/chains'
// import {ReactNode} from 'react'

// // Define the chains we want to support
// const chains = [avalancheFuji]

// // Create the wagmi config
// const config = createConfig(
//     getDefaultConfig({
//         appName: 'Goast Protocol',
//         // You should replace this with your project ID from WalletConnect
//         // https://cloud.walletconnect.com/
//         walletConnectProjectId: '928996a562ebd502c7b97128dccf0e74',
//         // chains,
//     })
// )

// interface WagmiConfigProps {
//     children: ReactNode
// } 

// export function WagmiConfig({children}: WagmiConfigProps) {
//     return (
//         <WagmiConfigProvider config={config}>
//             <ConnectKitProvider mode="dark">
//                 {children}
//             </ConnectKitProvider>
//         </WagmiConfigProvider>
//     )
// }

import { createConfig, WagmiConfig as WagmiConfigProvider } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import { ReactNode } from 'react';

const chains = [avalanche];

const config = createConfig(
  getDefaultConfig({
    appName: 'Unicorn Foundation',
    walletConnectProjectId: '928996a562ebd502c7b97128dccf0e74',
    chains,
  })
);

interface WagmiConfigProps {
  children: ReactNode;
}

export function WagmiConfig({ children }: WagmiConfigProps) {
  return (
    <WagmiConfigProvider config={config}>
      <ConnectKitProvider
        mode="dark"
        options={{
          enforceSupportedChains: false,
        }}
      >
        {children}
      </ConnectKitProvider>
    </WagmiConfigProvider>
  );
}
