import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useResetPasswordMutation } from './../../generated/graphql';
import { Wrapper } from '../../components/Wrapper';
import { Form, Formik } from 'formik';
import { InputField } from '../../components/InputField';
import { Box, Button, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';

interface ResetPasswordProps {

}

export const ResetPassword: React.FC<ResetPasswordProps> = () => {
    const [, reset] = useResetPasswordMutation();
    const router = useRouter();
    const { pid } = router.query;
    const [error, setError] = useState('');
    
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ password: "", confirmPassword: "" }}
                onSubmit={async (values, { setFieldError, setFieldTouched, setSubmitting}) => {
                    if (values.password !== values.confirmPassword) {
                        setFieldError('confirmPassword', "passwords don't match");
                        setFieldTouched('confirmPassword', true, false);
                        setSubmitting(false);
                        return;
                    }
                    const response = await reset({userId: Number(pid), password: values.password });
                    if (!response.data?.resetPassword) {
                        setError('server error');
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
            {error && <Box><Text>{error}</Text></Box>}
        </Wrapper>
    )
}
export default withUrqlClient(createUrqlClient)(ResetPassword);