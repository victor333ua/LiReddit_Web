import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react"
import { Layout } from "../components/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from './../generated/graphql';
import NextLink from "next/link";

const Index = () => { 
  const [variables, setVariables] = useState({ limit: 10, cursor: null as null | string })
  const [{ data, fetching }] = usePostsQuery({ variables });
  // const { posts, hasMore } = data?.posts;
  return (
    <Layout>
      <Flex mb={6} align="center">
        <Heading>LiReddit</Heading>
        <NextLink href="/create-post">
          <Link  ml="auto" >create post</Link>
        </NextLink>
      </Flex>
       
       {!data 
        ? (<div>loading...</div>) 
        : (
          <>
            <Stack spacing={8} >
              {data.posts.posts.map(p => (
                <Box
                  key={p.id}
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  flex="1"
                  borderRadius="md"
                >
                  <Heading fontSize="xl">{p.title}</Heading>
                  <Text mt={4}>{p.textSnippet}</Text>
                </Box>
              ))}
            </Stack>
          
            {data.posts.hasMore && 
              <Flex>
                <Button 
                  m="auto" 
                  my={8} 
                  isLoading={fetching} 
                  onClick={() => setVariables({
                    limit: variables.limit, 
                    cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
                  })}
                >
                  load more
                </Button>
              </Flex>
            }
          </>
        )
       }
    </Layout>
  )
}
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
