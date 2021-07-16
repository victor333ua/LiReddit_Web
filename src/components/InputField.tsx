import { FormControl, FormErrorMessage, FormLabel, Input, InputProps } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react'

type InputFieldProps = 
   React.InputHTMLAttributes<HTMLInputElement> & 
   InputProps &    
  // FieldHookConfig<string> &
   {
       label: string,
   };

export const InputField: React.FC<InputFieldProps> = ({ 
  label,
  ...props
  }) => {
    const [field, { error, touched }] = useField(props.name);
        return (
            <FormControl isInvalid={Boolean(error)}>
              <FormLabel htmlFor={field.name} >{label}</FormLabel>
              <Input 
                {...field} 
                {...props}
                id={field.name}
              />
              {touched && error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </FormControl>
        );
}