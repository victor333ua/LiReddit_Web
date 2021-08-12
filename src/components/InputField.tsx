import { FormControl, FormErrorMessage, FormLabel, Input, InputProps } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react'

type InputFieldProps = 
   React.InputHTMLAttributes<HTMLInputElement> & 
   InputProps &    
  // FieldHookConfig<string> &
   {
       label: string,
       name: string
   };

export const InputField: React.FC<InputFieldProps> = ({ 
  label,
  name,
  ...props
  }) => {
    const [field, { error, touched }] = useField(name);
        return (
            <FormControl isInvalid={Boolean(error)}>
              <FormLabel htmlFor={name} >{label}</FormLabel>
              <Input 
                {...field} 
                {...props}
                id={name}
              />
              {touched && error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </FormControl>
        );
}