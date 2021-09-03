import { Flex, Heading, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { ButtonsPostOperations } from '../../components/ButtonsPostOperations';
import { Layout } from '../../components/Layout';
import { Loader } from '../../components/Loader';
import { ServerError } from '../../components/ServerError';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { usePostFromPageRoute } from '../../utils/usePostFromRoute';

const ExtendedPost: NextPage = () => {
    const{ data, fetching, error } = usePostFromPageRoute();

    if (fetching) {
        return <Loader />;
    };
    const post = data?.post;
    if (!post) {
        return <ServerError error={error}/>      
    };
      
    return (post && (
        <Layout> 
            <Flex justify="space-between">          
                <Flex direction="column"  align="center" mr={6}>
                    <Heading fontSize="xl">{post.title}</Heading>
                    <Text mt={6}>{post.text}</Text>
                </Flex>
                <ButtonsPostOperations post={post} />
            </Flex>
        </Layout>
    ));
}
export default withUrqlClient(createUrqlClient)(ExtendedPost);
