'use client'

import { FrameProvider } from '@/components/farcaster-provider'
import { WalletProvider } from '@/components/wallet-provider'
import { MiniKitProvider } from '@coinbase/onchainkit/minikit'
import { ReactNode } from 'react'
import { base } from 'wagmi/chains'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <FrameProvider>
        <MiniKitProvider
          apiKey="c952c24e-698b-438d-8596-519b31d0c857"
          chain={base}
        >
          {children}
        </MiniKitProvider>
      </FrameProvider>
    </WalletProvider>
  )
}

export function MiniKitContextProvider({ children }: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey="c952c24e-698b-438d-8596-519b31d0c857"
      chain={base}
    >
      {children}
    </MiniKitProvider>
  )
}
