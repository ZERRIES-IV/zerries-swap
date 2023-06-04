// import PropTypes from 'prop-types';
// import '../styles/global.css'
import './App.css'
import './index.css'

import merge from 'lodash.merge'
import '@rainbow-me/rainbowkit/styles.css'

import {
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme,
} from '@rainbow-me/rainbowkit'

import { mainnet, configureChains, createConfig, WagmiConfig } from 'wagmi'
// import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import Header from './components/Header'
import SwapComponent from './components/SwapComponent'


const {chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider() ],
)

// infuraProvider({
//   apiKey: 'f0267a8d7d5642caa8735db53507eefd',
//   priority: 1,
// }),

const { connectors } = getDefaultWallets({
  appName: 'Custom Dex',
  chains
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

const myTheme = merge(midnightTheme(), {
  colors: {
    accentColor: '#27292E',
    accentColorForeground: '#fff',
  },
})

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={myTheme}>
        <div className='w-full h-screen flex flex-col items-center justify-center bg-[#27292E]'>
          <Header />
          <SwapComponent />
          {/* <Footer /> */}
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

// MyApp.propTypes = {
//   Component: PropTypes.elementType,
//   pageProps: PropTypes.object,
// };

export default App;
