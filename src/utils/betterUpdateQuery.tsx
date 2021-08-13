import { QueryInput, Cache } from "@urql/exchange-graphcache";


export function betterUpdateQuery<Result, Query>(
  qi: QueryInput,
  cache: Cache,
  result: Result,
  fn: (_result: Result, data: Query) => Query
) {
  cache.updateQuery(qi, data => fn(result, data as any) as any);
}
