import { dedupExchange, errorExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';
import router from 'next/router';


export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4001/graphql',
    fetchOptions: {
      credentials: "include" as const
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
      }),
      errorExchange({
        onError(error) {
          if (error.message.includes('not authenticated')) {
            router.replace("/login");
          }
        },
      }),
      ssrExchange,
      fetchExchange
    ]
});
