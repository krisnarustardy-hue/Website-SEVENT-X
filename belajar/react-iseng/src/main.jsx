import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import App from './App.jsx'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    heading: `'Figtree', sans-serif`,
    body: `'Inter', sans-serif`,
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
)