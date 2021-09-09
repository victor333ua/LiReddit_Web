import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Flex, Text } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useForgotPasswordMutation, useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    const [messageEmail, setMessageEmail] = useState('');

    const [, forgotPassword] = useForgotPasswordMutation();
    const passwordRequest = async (
        usernameOrEmail: string,
        setFieldError:  (field: string, message: string | undefined) => void,
        setFieldTouched: (field: string, isTouched?: boolean | undefined, shouldValidate?: boolean | undefined) => void
    ) => {
        const response = await forgotPassword({ usernameOrEmail });
        const errors = response.data?.forgotPassword.errors;
        if (errors) {
            if (errors[0].field === "failEmail") {
                setMessageEmail("Sending email server error");
            }
            else {
                setFieldError(errors[0].field, errors[0].message);
                setFieldTouched('usernameOrEmail', true, false);
            }
            return;
        }
        setMessageEmail(
            "Email to you has sucessfully sent.\n"+
            "Check email box and follow further instructions"
        );   
    }

    const dialogRef = React.useRef<any>();

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ usernameOrEmail: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                   const response = await login(values);
                   if (response.data?.login.errors) {
                       setErrors(
                            toErrorMap(response.data.login.errors)
                       );
                   }
                   else if (response.data?.login.user) {
                       if (typeof router.query.next === 'string') {
                          router.push(router.query.next) ;
                       } else {
                           router.push("/");
                       }
                   }                   
                }}
            >
               {({ isSubmitting, values, setFieldError, setFieldTouched }) => (
                <Form>
                    <InputField 
                            name="usernameOrEmail"
                            placeholder="username or email"
                            label="Username or Email"
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
                    <Flex mt={4} >
                        <Text fontSize="sm" fontStyle="italic">Forgot password?</Text>
                        <Button
                            ml={2} 
                            variant="link" 
                            colorScheme="blue" 
                            size="sm"
                            _focus={{ boxShadow: 'none !important' }}
                            _active={{ border: '1px blue !important' }}
                            onClick={() => passwordRequest(values.usernameOrEmail, setFieldError, setFieldTouched)}
                            >
                            Send me email
                        </Button>
                    </Flex> 
                    <br />
                    <AlertDialog
                      isOpen={!!messageEmail}
                      onClose={() => setMessageEmail('')}
                      leastDestructiveRef={dialogRef}
                    >
                      <AlertDialogOverlay>
                          <AlertDialogContent background="beige">
                              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                  Reset Password
                              </AlertDialogHeader>
                              <AlertDialogBody>
                                  {messageEmail}
                              </AlertDialogBody>
                              <AlertDialogFooter>
                                  <Button ref={dialogRef} background="grey" onClick={() => setMessageEmail('')}>
                                      OK
                                  </Button>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialogOverlay>      
                    </AlertDialog>                                                       
                </Form> 
               )}
            </Formik>
        </Wrapper>
    )    
}

export default withUrqlClient(createUrqlClient)(Login);