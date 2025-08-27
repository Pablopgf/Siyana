import { useAccount, useBalance } from 'wagmi'
import { useFrame } from '@/components/farcaster-provider'

interface HeaderProps {
  showProductDetail?: boolean;
  onBalanceClick?: () => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ showProductDetail = false, onBalanceClick, onLogoClick }) => {
  const { context } = useFrame()
  const account = useAccount();
  
  const { data: balanceData, isLoading, error } = useBalance({
    address: account.address,
    token: '0xc7562d0536D3bF5A92865AC22062A2893e45Cb07' as `0x${string}`,
    chainId: 8453,
  });

  return (
    <div className="fixed top-0 left-0 w-full bg-black text-white px-1 py-1 grid grid-cols-3 items-center z-50">
      <div className="flex items-center">
        <img
          src="/images/syyn.gif"
          alt="SYYN"
          className="w-8 h-8 rounded-full border-2 border-white"
        />
        <span 
          className="text-white text-xs ml-2 cursor-pointer hover:text-gray-300 transition-colors"
          onClick={onBalanceClick}
        >
          {account.address ? (
            balanceData ? parseFloat(balanceData.formatted).toLocaleString() : '0.00'
          ) : 'Connect Wallet'} SYYN
          {isLoading && account.address && <span className="text-yellow-400">(Loading...)</span>}
          {error && <span className="text-orange-400 text-[8px]">(Switch to Base)</span>}
        </span>
      </div>
      <div className="flex justify-center">
        
      </div>
        <div className="flex justify-end items-center">
          <img
              src="/images/SIYANA WORDMARK WHITE.png"
              alt="Logo"
              className="w-12 h-12 object-contain cursor-pointer hover:opacity-80 transition-opacity mr-2"
              onClick={onLogoClick}
            />
        {context?.user?.pfpUrl && (
          <img
            src={context.user.pfpUrl}
            alt="User Profile"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        )}
      </div>
    </div>
  );
}; 