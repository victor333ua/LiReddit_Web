import React from 'react';
import { Form, Formik } from 'formik';
import { Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                   const response = await login({ options: values });
                   if (response.data?.login.errors) {
                       setErrors(
                            toErrorMap(response.data.login.errors)
                       );
                   }
                   else if (response.data?.login.user) {
                       router.push("/");
                   }                   
                }}
            >
               {({ isSubmitting }) => (
                <Form>
                    <InputField 
                            name="username"
                            placeholder="username"
                            label="User Name"
                    /> 
                    <br/>
                    <InputField 
                            name="password"
                            placeholder="password"
                            label="Password"
                            type="password"
                    />  
                    <Button 
                        mt={8} 
                        type="submit" 
                        colorScheme="teal"
                        isLoading={isSubmitting}
                    >
                       login
                    </Button>                 
                </Form> 
               )}
            </Formik>
        </Wrapper>
    )    
}

export default withUrqlClient(createUrqlClient)(Login);