import { useAccount, useBalance } from 'wagmi'
import { base } from 'viem/chains'
import { useState, useEffect } from 'react'

interface BalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BalanceModal: React.FC<BalanceModalProps> = ({ isOpen, onClose }) => {
  const account = useAccount();
  const [syynPrice, setSyynPrice] = useState<number | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  
  const { data: nativeBalance } = useBalance({
    address: account.address,
    chainId: 8453,
  });

  const { data: syynBalance } = useBalance({
    address: account.address,
    token: '0xc7562d0536D3bF5A92865AC22062A2893e45Cb07' as `0x${string}`,
    chainId: 8453,
  });

  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoadingPrices(true);
      try {
        const syynResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/token_price/base?contract_addresses=0xc7562d0536d3bf5a92865ac22062a2893e45cb07&vs_currencies=usd'
        );
        const syynData = await syynResponse.json();
        setSyynPrice(syynData['0xc7562d0536d3bf5a92865ac22062a2893e45cb07']?.usd || null);

        const ethResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        const ethData = await ethResponse.json();
        setEthPrice(ethData.ethereum?.usd || null);
      } catch (error) {
        console.error('Error fetching prices:', error);
      } finally {
        setIsLoadingPrices(false);
      }
    };

    if (isOpen) {
      fetchPrices();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Wallet Balance</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Account</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-mono text-gray-800">
                {account.address ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : 'Not connected'}
              </span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-600">Network</span>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">B</span>
              </div>
              <span className="text-sm font-medium text-gray-800">Base</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4">
                              <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/images/siyana.png"
                      alt="SYYN"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-medium text-gray-800">Siyana <span className="text-gray-500">SYYN</span></span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {isLoadingPrices ? 'Loading...' : syynPrice ? `$${syynPrice.toFixed(6)}` : 'Siyana Token'}
                  </span>
                </div>
              <div className="text-2xl font-bold text-gray-900">
                {syynBalance ? parseFloat(syynBalance.formatted).toLocaleString() : '0.00'}
              </div>
              <div className="text-sm text-gray-600">
                {isLoadingPrices ? (
                  'Loading price...'
                ) : syynPrice && syynBalance ? (
                  `≈ $${(parseFloat(syynBalance.formatted) * syynPrice).toFixed(2)} USD`
                ) : (
                  '≈ $0.00 USD'
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4">
                              <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src="https://assets.coingecko.com/coins/images/279/small/ethereum.png"
                      alt="ETH"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-medium text-gray-800">Ethereum <span className="text-gray-500">ETH</span></span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {isLoadingPrices ? 'Loading...' : ethPrice ? `$${ethPrice.toFixed(2)}` : 'Ethereum'}
                  </span>
                </div>
              <div className="text-2xl font-bold text-gray-900">
                {nativeBalance ? parseFloat(nativeBalance.formatted).toFixed(8) : '0.00000000'}
              </div>
              <div className="text-sm text-gray-600">
                {isLoadingPrices ? (
                  'Loading price...'
                ) : ethPrice && nativeBalance ? (
                  `≈ $${(parseFloat(nativeBalance.formatted) * ethPrice).toFixed(2)} USD`
                ) : (
                  '≈ $0.00 USD'
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}; 