import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useResetPasswordMutation } from '../../generated/graphql';
import { Wrapper } from '../../components/Wrapper';
import { Form, Formik } from 'formik';
import { InputField } from '../../components/InputField';
import { Box, Button, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import * as Yup from 'yup';
import { NextPage } from 'next';


export const ResetPassword: NextPage<{ token: string }> = ({ token }) => {
    const [, reset] = useResetPasswordMutation();
    const router = useRouter();
  //  const { token } = router.query;
    const [error, setError] = useState('');
    
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ password: "", confirmPassword: "" }}
                validationSchema={Yup.object({
                    password: Yup.string()
                        .min(3, 'Must be 3 characters or more')
                        .max(6, 'Must be 6 characters or less')
                        .required('Required')
                })}
                onSubmit={async (values, { setFieldError, setFieldTouched, setSubmitting}) => {
                    if (values.password !== values.confirmPassword) {
                        setFieldError('confirmPassword', "passwords don't match");
                        setFieldTouched('confirmPassword', true, false);
                        setSubmitting(false);
                        return;
                    }
                    const response = await reset({
                        token,
                        password: values.password 
                    });
                    if (!response.data?.resetPassword) {
                        setError('token expired');
                    }
                    else {
                        router.push("/login");
                    }                   
                }}
            >
               {({ isSubmitting }) => (
                <Form>
                    <InputField 
                            name="password"
                            placeholder="new password"
                            label="Password"
                            type="password"
                    /> 
                    <br/>
                    <InputField 
                            name="confirmPassword"
                            placeholder="password"
                            label="Confirm Password"
                            type="password"
                    />  
                    <Button 
                        mt={8} 
                        type="submit" 
                        colorScheme="teal"
                        isLoading={isSubmitting}
                    >
                       Reset
                    </Button>
                </Form> 
                )}
            </Formik>
            {error && <Box color="red"><Text>{error}</Text></Box>}
        </Wrapper>
    )
};

ResetPassword.getInitialProps = ({ query }) => {
    return {
      token: query.token as string,
    };
  };
export default withUrqlClient(createUrqlClient)(ResetPassword);