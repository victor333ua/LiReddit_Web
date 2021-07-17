import React from 'react';
import { Form, Formik } from 'formik';
import { Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import * as Yup from 'yup';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: "", password: "" }}
                validationSchema={Yup.object({
                    password: Yup.string()
                        .min(3, 'Must be 3 characters or more')
                        .max(6, 'Must be 6 characters or less')
                        .required('Required'),
                    username: Yup.string()
                        .max(6, 'Must be 6 characters or less')
                        .required('Required'),
                  })}
                onSubmit={async (values, { setErrors }) => {
                   const response = await register(values);
                   // setSubmitting(false);
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
                            name="password"
                            placeholder="password"
                            label="Password"
                            type="password"
                    />  
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

export default Register