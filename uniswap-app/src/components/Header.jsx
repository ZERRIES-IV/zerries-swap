import NavItems from './NavItems'
import toast,{ Toaster } from 'react-hot-toast'
import UNISWAP from '../assets/logo.png'
import { useEffect, useState } from 'react'
import TokenBalance from './TokenBalance'

import { ConnectButton } from '@rainbow-me/rainbowkit'

import { useAccount } from 'wagmi'

const Header = () => {
  const [tokenBalComp, setTokenBalComp] = useState()

  const { address } = useAccount()

  const notifyConnectWallet = () =>
    toast.error('Connect wallet.', { duration: 2000 })

  useEffect(() => {
    setTokenBalComp(
      <>
        <TokenBalance name={'CoinA'} walletAddress={address} />
        <TokenBalance name={'CoinB'} walletAddress={address} />
        <TokenBalance name={'CoinC'} walletAddress={address} />
      </>,
    )

    if (!address) notifyConnectWallet()
  }, [address])

  return (
    <div className='w-full py-2 pt-9 flex justify-between max-[468px]:flex-none max-[468px]:grid max-[468px]:pt-2'>
      <div className='flex items-center '>
        <img src={UNISWAP} className='h-16' />
        <NavItems />
      </div>
      <div className='flex items-center justify-end max-[468px]:flex-none'>
        <div className='bg-zinc-900 rounded-full mx-6 px-3 py-3 cursor-pointer'>
        <a href="https://venom.network/" target='_blank' rel="noreferrer">
          <img src="https://venom.network/static/media/venom.16a64f94cf5ab97ccaa7d88c840e3059.svg" width="70px" srcSet="" alt="Venom" />
        </a>
        </div>
          <ConnectButton className='mx-8' accountStatus={'full'} />
      </div>
      
      {/* <div className='flex items-center'>{tokenBalComp}</div> */}
      <Toaster />
    </div>
  )
}


export default Header
