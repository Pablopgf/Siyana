'use client'

import HomeShop from '@/components/Home'
import { useFrame } from '@/components/farcaster-provider'
import { SafeAreaContainer } from '@/components/safe-area-container'
import { useEffect, useState } from 'react'
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { useAccount, useBalance } from 'wagmi'
import ImagePreloader from '@/components/ImagePreloader'

export default function Home() {
  const { context, isLoading, isSDKLoaded } = useFrame()
  const { setFrameReady, isFrameReady } = useMiniKit()
  const [balancesLoaded, setBalancesLoaded] = useState(false)
  const [imagesPreloaded, setImagesPreloaded] = useState(false)
  
  const account = useAccount();
  
  const { data: nativeBalance, isLoading: isLoadingNative } = useBalance({
    address: account.address,
    chainId: 8453,
  });

  const { data: syynBalance, isLoading: isLoadingSyyn } = useBalance({
    address: account.address,
    token: '0xc7562d0536D3bF5A92865AC22062A2893e45Cb07' as `0x${string}`,
    chainId: 8453,
  });

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady()
    }
  }, [setFrameReady, isFrameReady])

  useEffect(() => {
    if (account.address && !isLoadingNative && !isLoadingSyyn && (nativeBalance || syynBalance)) {
      const timer = setTimeout(() => {
        setBalancesLoaded(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else if (!account.address) {
      setBalancesLoaded(true);
    }
  }, [account.address, isLoadingNative, isLoadingSyyn, nativeBalance, syynBalance]);

  if (isLoading || !isSDKLoaded || !balancesLoaded || !imagesPreloaded) {
    return (
      <SafeAreaContainer insets={context?.client.safeAreaInsets} className="bg-black">
        {!imagesPreloaded ? (
          <ImagePreloader onImagesLoaded={() => setImagesPreloaded(true)} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <img
              src="/images/syyn.gif"
              alt="Siyana"
              className="w-20 h-20 mb-4"
            />
          </div>
        )}
      </SafeAreaContainer>
    )
  }

  if (!isSDKLoaded) {
    return (
      <SafeAreaContainer insets={context?.client.safeAreaInsets}>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 space-y-8">
          <h1 className="text-3xl font-bold text-center">
            No farcaster SDK found, please use this miniapp in the farcaster app
          </h1>
        </div>
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <HomeShop />
    </SafeAreaContainer>
  )
}
