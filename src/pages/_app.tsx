import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import theme from '../theme';
import { MeDocument, LoginMutation, MeQuery, RegisterMutation } from '../generated/graphql';
 
// function betterUpdateQuery<Result, Query> (
//   qi: QueryInput,
//   cache: Cache,
//   result: Result,
//   fn: (_result: Result, data: Query) => Query
// ) {
//     cache.updateQuery(qi, data => fn(result, data as any) as any);
// }

const client = createClient({
    url: 'http://localhost:4001/graphql',
    fetchOptions: {
      credentials: "include"
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {
            login: (result: LoginMutation, args, cache, info) => {
              cache.updateQuery(
                { query: MeDocument }, 
                (data: MeQuery | null) => {
                  if(result.login?.errors) return data;
                  else return { me: result.login.user };
                }
              )
            },
            register: (result: RegisterMutation, args, cache, info) => {
              cache.updateQuery(
                { query: MeDocument }, 
                (data: MeQuery | null) => {
                  if(result.register?.errors) return data;
                  else return { me: result.register.user };
                }
              )
            },
            logout: (result, args, cache, info) => {
              cache.updateQuery(
                { query: MeDocument }, 
                () => ({ me: null })
              )
            }
          }
        }
      }), fetchExchange]
  });

  function MyApp({ Component, pageProps }: any) {
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
