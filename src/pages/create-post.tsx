import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from "next/router";
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost: React.FC<{}> = ({}) => {
    const [, createPost] = useCreatePostMutation();
    const router = useRouter();
    useIsAuth();

    return (
        <Layout variant="small">
            <Formik
                initialValues={{ title: "", text: "" }}
                onSubmit={async (values) => {
                    const { error } = await createPost({ input: values });
                    if (!error) {
                        router.push("/");
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
                            isTextarea={true}
                    />  
                    <Button 
                        mt={8} 
                        type="submit" 
                        colorScheme="teal"
                        isLoading={isSubmitting}
                    >
                        create post
                    </Button>
                </Form> 
            )}
            </Formik>
        </Layout>
    );     
}
export default withUrqlClient(createUrqlClient)(CreatePost);