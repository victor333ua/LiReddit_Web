import { dedupExchange, errorExchange, fetchExchange, gql } from 'urql';
import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { LoginMutation, MeDocument, MeQuery, RegisterMutation, VoteMutationVariables } from '../generated/graphql';
import router from 'next/router';
import { isServer } from './isServer';

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {

    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    // console.log("allFields: ", allFields);

    // all cached queries with 'posts' fieldName (maybe different args)
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    // console.log("fieldArgs: ", fieldArgs);
    // const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCash = cache.resolve(entityKey, fieldName, fieldArgs);
    info.partial = !isItInTheCash;

    const results: string[] = [];
    let hasMore = true;
    fieldInfos.forEach(fi => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      if (!cache.resolve(key, "hasMore")) hasMore = false;
      // console.log(data);
      results.push(...data);
    });

    return { 
      __typename: "PostsResponse",
      posts: results,
      hasMore 
    };    
  }
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer()) {
    cookie = ctx.req.headers.cookie;
  }

  return {
    url: 'http://localhost:4001/graphql',
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie ? { cookie } : undefined
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PostsResponse: () => null
        },
        resolvers: {
          Query: {
            posts: cursorPagination()
          }
        },
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
            },
            createPost: (result, args, cache, info) => {
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(info => info.fieldName === "posts");
              fieldInfos.forEach(fi => {
                cache.invalidate("Query", "posts", fi.arguments)
              });
            },
            vote: (result, args, cache, info) => {
              
              const { postId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteValue
                  }
                `,
                { id: postId }
              );
              if (data) {
                if (data.voteValue === value) return;
                const correction = data.voteValue ? 2 * value : value;
                const newPoints = (data.points as number) + correction;
               
                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      id
                      points
                      voteValue
                    }
                  `,
                  { id: postId, points: newPoints, voteValue: value }
                );
              }
            },  
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
  };
}
