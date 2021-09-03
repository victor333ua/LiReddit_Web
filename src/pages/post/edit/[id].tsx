import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { Loader } from '../../../components/Loader';
import { ServerError } from '../../../components/ServerError';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { usePostFromPageRoute } from '../../../utils/usePostFromRoute';
import { useUpdatePostMutation } from './../../../generated/graphql';

export const EditPost: NextPage = ({}) => {
    const router = useRouter();
    const [, updatePost] = useUpdatePostMutation();
    const{ data, fetching, error, intId } = usePostFromPageRoute();

    if (fetching) {
        return <Loader />;
     };
     const post = data?.post;
     if (!post) {
         return <ServerError error={error}/>      
     };

     return (
        <Layout>
            <Formik
                initialValues={{ title: post.title, text: post.text }}
                onSubmit={async (values) => {
                    const { error } = await updatePost({ id: intId, ...values });
                    if (!error) {
                        router.back(); return null;
                    } else {
                        return <ServerError error={error}/>  
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