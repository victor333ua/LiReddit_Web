import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { useContext } from 'react';
import { PostSnippetFragment } from '../generated/graphql';
import { ButtonsPostOperations } from './ButtonsPostOperations';
import { LoggedContext } from './Layout';
import { UpdootSection } from './UpdootSection';

interface PostProps {
    post: PostSnippetFragment
}

export const Post: React.FC<PostProps> = ({ post }) => {
    const currentUser = useContext(LoggedContext);
    
    return (
        <Box
            key={post.id}
            p={5}
            shadow="md"
            borderWidth="1px"
            flex="1"
            borderRadius="md"
        >
            <Flex>
                {currentUser && <UpdootSection post={post} />}
                <Flex direction="column">
                    <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                        <Link>
                          <Heading fontSize="xl">{post.title}</Heading>
                        </Link>                     
                    </NextLink>
                    <Text fontSize="sm" as="i">posted by {post.creator.username}</Text>
                    <Text mt={4}>{post.textSnippet}</Text>
                </Flex>
                <ButtonsPostOperations post={post} />
            </Flex>
        </Box>
    )
}