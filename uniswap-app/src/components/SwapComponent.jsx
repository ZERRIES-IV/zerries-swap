import { useEffect, useState, useRef } from 'react'
import { Cog8ToothIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import SwapField from './SwapField'
import TransactionStatus from './TransactionStatus'
import toast, { Toaster } from 'react-hot-toast'
import { DEFAULT_VALUE, VENOM } from '../../utils/SupportedCoins'
import {
  hasValidAllowance,
  increaseAllowance,
  swapEthToToken,
  swapTokenToEth,
  swapTokenToToken,
} from '../../utils/queries'
import { toEth, toWei } from '../../utils/ether-utils'
import { useAccount } from 'wagmi'

const SwapComponent = () => {
  const [srcToken, setSrcToken] = useState(VENOM)
  const [destToken, setDestToken] = useState(DEFAULT_VALUE)

  const [inputValue, setInputValue] = useState()
  const [outputValue, setOutputValue] = useState()

  const inputValueRef = useRef()
  const outputValueRef = useRef()

  const isReversed = useRef(false)

  const INCREASE_ALLOWANCE = 'Increase allowance'
  const ENTER_AMOUNT = 'Enter an amount'
  const CONNECT_WALLET = 'Connect wallet'
  const SWAP = 'Swap'

  const srcTokenObj = {
    id: 'srcToken',
    value: inputValue,
    setValue: setInputValue,
    defaultValue: srcToken,
    ignoreValue: destToken,
    setToken: setSrcToken,
  }

  const destTokenObj = {
    id: 'destToken',
    value: outputValue,
    setValue: setOutputValue,
    defaultValue: destToken,
    ignoreValue: srcToken,
    setToken: setDestToken,
  }

  const [srcTokenComp, setSrcTokenComp] = useState()
  const [destTokenComp, setDestTokenComp] = useState()

  const [swapBtnText, setSwapBtnText] = useState(ENTER_AMOUNT)
  const [txPending, setTxPending] = useState(false)

  const notifyError = msg => toast.error(msg, { duration: 6000 })
  const notifySuccess = () => toast.success('Transaction completed.')

  const { address } = useAccount()

  useEffect(() => {
    // Handling the text of the submit button

    if (!address) setSwapBtnText(CONNECT_WALLET)
    else if (!inputValue || !outputValue) setSwapBtnText(ENTER_AMOUNT)
    else setSwapBtnText(SWAP)
  }, [inputValue, outputValue, address])

  useEffect(() => {
    if (
      document.activeElement !== outputValueRef.current &&
      document.activeElement.ariaLabel !== 'srcToken' &&
      !isReversed.current
    )
      populateOutputValue(inputValue)

    setSrcTokenComp(<SwapField obj={srcTokenObj} ref={inputValueRef} />)

    if (inputValue?.length === 0) setOutputValue('')
  }, [inputValue, destToken])

  useEffect(() => {
    if (
      document.activeElement !== inputValueRef.current &&
      document.activeElement.ariaLabel !== 'destToken' &&
      !isReversed.current
    )
      populateInputValue(outputValue)

    setDestTokenComp(<SwapField obj={destTokenObj} ref={outputValueRef} />)

    if (outputValue?.length === 0) setInputValue('')

    // Resetting the isReversed value if its set
    if (isReversed.current) isReversed.current = false
  }, [outputValue, srcToken])

  return (
    <div className='bg-[#1D1F24] w-fit h-fit my-9 p-4 px-6 rounded-xl max-[426px]:p-2 max-[426px]:px-3'>
      <div className='flex items-center justify-between py-4 px-1'>
        <p className='text-white font-bold text-[40px] max-[426px]:text-[30px]'>Swap</p>
        <Cog8ToothIcon className='h-11 text-white max-[426px]:h-9' />
      </div>
      <div className='relative bg-[#27292E] p-4 py-6 max-[426px]:p-2 rounded-xl mb-2 border-[2px] border-transparent hover:border-zinc-600 text-white'>
        {srcTokenComp}

        <ArrowsUpDownIcon
          className='absolute left-1/2 -translate-x-1/2 -bottom-6 h-10 p-1 bg-[#27292E] border-4 border-[#1D1F24] text-zinc-300 rounded-xl cursor-pointer hover:scale-110'
          onClick={handleReverseExchange}
        />
      </div>

      <div className='text-white bg-[#27292E] p-4 py-6 max-[426px]:p-2 rounded-xl mt-2 border-[2px] border-transparent hover:border-zinc-600'>
        {destTokenComp}
      </div>

      <div className="text-white font-bold text-[15px] flex justify-between p-2">
        <h2>Slippage Tolerance</h2>
        <h2>0.5%</h2>
      </div>

      <button
        className={getSwapBtnClassName()}
        onClick={() => {
          if (swapBtnText === INCREASE_ALLOWANCE) handleIncreaseAllowance()
          else if (swapBtnText === SWAP) handleSwap()
        }}
      >
        {swapBtnText}
      </button>

      {txPending && <TransactionStatus />}

      <Toaster />
    </div>
  )

  async function handleSwap() {
    if (srcToken === VENOM && destToken !== VENOM) {
      performSwap()
    } else {
      // Check whether there is allowance when the swap deals with tokenToEth/tokenToToken
      setTxPending(true)
      const result = await hasValidAllowance(address, srcToken, inputValue)
      setTxPending(false)

      if (result) performSwap()
      else handleInsufficientAllowance()
    }
  }

  async function handleIncreaseAllowance() {
    // Increase the allowance
    setTxPending(true)
    await increaseAllowance(srcToken, inputValue)
    setTxPending(false)

    // Set the swapbtn to "Swap" again
    setSwapBtnText(SWAP)
  }

  function handleReverseExchange() {
    // Setting the isReversed value to prevent the input/output values
    // being calculated in their respective side - effects
    isReversed.current = true

    // 1. Swap tokens (srcToken <-> destToken)
    // 2. Swap values (inputValue <-> outputValue)

    setInputValue(outputValue)
    setOutputValue(inputValue)

    setSrcToken(destToken)
    setDestToken(srcToken)
  }

  function getSwapBtnClassName() {
    let className = 'bg-[#27292E] p-4 w-full my-2 rounded-xl font-black'
    className +=
      swapBtnText === ENTER_AMOUNT || swapBtnText === CONNECT_WALLET
        ? ' text-[#8F8F8F] bg-zinc-800 pointer-events-none'
        : ' bg-blue-700 pointer-events'
    className += swapBtnText === INCREASE_ALLOWANCE ? ' bg-yellow-600' : ''
    return className
  }

  function populateOutputValue() {
    if (
      destToken === DEFAULT_VALUE ||
      srcToken === DEFAULT_VALUE ||
      !inputValue
    )
      return

    try {
      if (srcToken !== VENOM && destToken !== VENOM) setOutputValue(inputValue)
      else if (srcToken === VENOM && destToken !== VENOM) {
        const outValue = toEth(toWei(inputValue), 14)
        setOutputValue(outValue)
      } else if (srcToken !== VENOM && destToken === VENOM) {
        const outValue = toEth(toWei(inputValue, 14))
        setOutputValue(outValue)
      }
    } catch (error) {
      setOutputValue('0')
    }
  }

  function populateInputValue() {
    if (
      destToken === DEFAULT_VALUE ||
      srcToken === DEFAULT_VALUE ||
      !outputValue
    )
      return

    try {
      if (srcToken !== VENOM && destToken !== VENOM) setInputValue(outputValue)
      else if (srcToken === VENOM && destToken !== VENOM) {
        const outValue = toEth(toWei(outputValue, 14))
        setInputValue(outValue)
      } else if (srcToken !== VENOM && destToken === VENOM) {
        const outValue = toEth(toWei(outputValue), 14)
        setInputValue(outValue)
      }
    } catch (error) {
      setInputValue('0')
    }
  }

  async function performSwap() {
    setTxPending(true)

    let receipt

    if (srcToken === VENOM && destToken !== VENOM)
      receipt = await swapEthToToken(destToken, inputValue)
    else if (srcToken !== VENOM && destToken === VENOM)
      receipt = await swapTokenToEth(srcToken, inputValue)
    else receipt = await swapTokenToToken(srcToken, destToken, inputValue)

    setTxPending(false)

    if (receipt && !receipt.hasOwnProperty('transactionHash'))
      notifyError(receipt)
    else notifySuccess()
  }

  function handleInsufficientAllowance() {
    notifyError(
      "Insufficient allowance. Click 'Increase allowance' to increase it.",
    )
    setSwapBtnText(INCREASE_ALLOWANCE)
  }
}

export default SwapComponent
