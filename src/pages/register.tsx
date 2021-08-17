import React from 'react';
import { Form, Formik } from 'formik';
import { Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import * as Yup from 'yup';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { useRegisterMutation } from './../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: "", password: "", email: "" }}
                validationSchema={Yup.object({
                    password: Yup.string()
                        .min(3, 'Must be 3 characters or more')
                        .max(6, 'Must be 6 characters or less')
                        .required('Required'),
                    username: Yup.string()
                        .max(6, 'Must be 6 characters or less')
                        .required('Required'),
                    email: Yup.string()
                        .email('Invalid email')
                        .required('Required'),
                  })}
                onSubmit={async (values, { setErrors }) => {
                   const response = await register({ options: values });
                  
                   if (response.data?.register.errors) {
                       setErrors(
                            toErrorMap(response.data.register.errors)
                       );
                   }
                   else if (response.data?.register.user) {
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
                            name="email"
                            placeholder="email"
                            label="Email"
                    /> 
                    <br />
                    <InputField 
                            name="password"
                            placeholder="password"
                            label="Password"
                            type="password"
                    /> 
                    <br />
                    <br /> 
                    <Button 
                        mt={4} 
                        type="submit" 
                        colorScheme="teal"
                        isLoading={isSubmitting}
                    >
                        register 
                    </Button>  
                </Form> 
               )}
            </Formik>
        </Wrapper>
    )    
}

export default withUrqlClient(createUrqlClient)(Register);