import { Flex, Heading, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { ButtonsPostOperations } from '../../components/ButtonsPostOperations';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useExtendedPostQuery } from './../../generated/graphql';

const ExtendedPost: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const intId = typeof(id) === 'string' ?  parseInt(id) : -1;

    const [{ data, fetching }] = useExtendedPostQuery({
        pause: intId === -1,
        variables: { id: intId }
    });

    if (!data) {
        return (
          <Layout>
            {fetching && <div>loading...</div>}
            {!fetching && <div>server error</div>}
          </Layout>
        )
    }
    const post = data?.post;
    if (!post) return (
        <Layout>
            <div>No data</div>
        </Layout>
    );
   
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
