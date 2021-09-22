import React from 'react'
import NavBar from './NavBar';
import { UserProvider } from './UserProvider';
import { Wrapper, WrapperVariant } from './Wrapper';

interface LayoutProps {
    variant?: WrapperVariant
};

export const Layout: React.FC<LayoutProps> = ({ children, variant = "regular" }) => {
   
    return (
        <UserProvider>
            <NavBar variant={variant} />
            <Wrapper variant={variant}>      
                {children}
            </Wrapper>            
        </UserProvider>
    )
};