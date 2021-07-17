import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import theme from '../theme';
import { createClient, Provider } from 'urql';

function MyApp({ Component, pageProps }) {
  const client = createClient({
    url: 'http://localhost:4001/graphql',
    fetchOptions: {
      credentials: "include"
    }
  });

  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
