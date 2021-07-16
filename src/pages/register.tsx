import React from 'react';
import { Form, Formik } from 'formik';
import { Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import * as Yup from 'yup';

interface registerProps {

}

const Register: React.FC<registerProps> = ({}) => {
        return (
            <Wrapper>
                <Formik
                    initialValues={{ username: "", password: "" }}
                    validationSchema={Yup.object({
                        password: Yup.string()
                            .min(5, 'Must be 5 characters or more')
                            .max(6, 'Must be 6 characters or less')
                            .required('Required'),
                        username: Yup.string()
                            .email('Invalid email address')
                            .required('Required'),
                      })}
                    onSubmit={(values, { setSubmitting }) => {
                        console.log(values);
                        setSubmitting(false);
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