import { dedupExchange, errorExchange, fetchExchange, stringifyVariables } from 'urql';
import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';
import router from 'next/router';

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    console.log("allFields: ", allFields);

    // all cached queries with 'posts' fieldName (maybe different args)
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    console.log("fieldArgs: ", fieldArgs);
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

    // const visited = new Set();
    // let result: NullArray<string> = [];
    // let prevOffset: number | null = null;

    // for (let i = 0; i < size; i++) {
    //   const { fieldKey, arguments: args } = fieldInfos[i];
    //   if (args === null || !compareArgs(fieldArgs, args)) {
    //     continue;
    //   }

    //   const links = cache.resolve(entityKey, fieldKey) as string[];
    //   const currentOffset = args[offsetArgument];

    //   if (
    //     links === null ||
    //     links.length === 0 ||
    //     typeof currentOffset !== 'number'
    //   ) {
    //     continue;
    //   }

    //   const tempResult: NullArray<string> = [];

    //   for (let j = 0; j < links.length; j++) {
    //     const link = links[j];
    //     if (visited.has(link)) continue;
    //     tempResult.push(link);
    //     visited.add(link);
    //   }

    //   if (
    //     (!prevOffset || currentOffset > prevOffset) ===
    //     (mergeMode === 'after')
    //   ) {
    //     result = [...result, ...tempResult];
    //   } else {
    //     result = [...tempResult, ...result];
    //   }

    //   prevOffset = currentOffset;
    // }

    // const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
    // if (hasCurrentPage) {
    //   return result;
    // } else if (!(info as any).store.schema) {
    //   return undefined;
    // } else {
    //   info.partial = true;
    //   return result;
    // }
  }
}

export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4001/graphql',
    fetchOptions: {
      credentials: "include" as const
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
