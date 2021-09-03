import { Button, Flex, Heading, Stack } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react"
import { Layout } from "../components/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from './../generated/graphql';
import { Post } from "../components/Post";

const Index = () => { 
  const [variables, setVariables] = useState({ limit: 10, cursor: null as null | string })
  const [{ data, fetching }] = usePostsQuery({ variables });
 
  if (!data) {
      return (
        <Layout>
          {fetching && <div>loading...</div>}
          {!fetching && <div>server error</div>}
        </Layout>
      )
  }
  const posts = data.posts?.posts;

  return (
    <Layout>
      <Flex mb={6}>
        <Heading>LiReddit</Heading>
      </Flex>
       
       {posts && (
          <>
            <Stack spacing={8} >
              {posts.map(p => p ? <Post post={p}/> : null)}
            </Stack>
          
            {data.posts.hasMore && 
              <Flex>
                <Button 
                  m="auto" 
                  my={8} 
                  isLoading={fetching} 
                  onClick={() => setVariables({
                    limit: variables.limit, 
                    cursor: posts[posts.length - 1].createdAt
                  })}
                >
                  load more
                </Button>
              </Flex>
            }
          </>
       )}
    </Layout>
  )
}
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
