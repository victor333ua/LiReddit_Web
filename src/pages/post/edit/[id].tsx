import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { useExtendedPostQuery } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useUpdatePostMutation } from './../../../generated/graphql';

export const EditPost: NextPage = ({}) => {
    const router = useRouter();
    const { id } = router.query;
    const intId = typeof(id) === 'string' ?  parseInt(id) : -1;

    const [{ data, fetching, error }] = useExtendedPostQuery({
        pause: intId === -1,
        variables: { id: intId }
    });

    const [, updatePost] = useUpdatePostMutation();

    if (fetching) {
        return (
          <Layout>
            <div>loading...</div>
          </Layout>
        )
    };
    const post = data?.post;
    if (!post) return (
        <Layout>
            <Box>
                <Heading>Server Error</Heading>
                <Text>{error?.message}</Text>
            </Box>
        </Layout>
    );

    return (
        <Layout>
            <Formik
                initialValues={{ title: post.title, text: post.text }}
                onSubmit={async (values) => {
                    const { error } = await updatePost({ id: intId, ...values });
                    if (!error) {
                        router.back();
                    } else {
                        console.log("error: ", error.message);
                    }
                }}
            >
            {({ isSubmitting }) => (
                <Form>
                    <InputField 
                            name="title"
                            placeholder="title"
                            label="Title"
                    /> 
                    <br/>
                    <InputField 
                            name="text"
                            placeholder="...text"
                            label="Body"
                            textarea
                    />  
                    <Button 
                        mt={8} 
                        type="submit" 
                        colorScheme="teal"
                        isLoading={isSubmitting}
                    >
                        update post
                    </Button>
                </Form> 
            )}
            </Formik>
        </Layout>
    )  
}
export default withUrqlClient(createUrqlClient)(EditPost);