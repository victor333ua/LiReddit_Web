import React, { createContext, useState } from 'react'
import { RegularUserFragment } from '../generated/graphql';
import NavBar from './NavBar';
import { Wrapper, WrapperVariant } from './Wrapper';

interface LayoutProps {
    variant?: WrapperVariant
};

export const LoggedContext = createContext<RegularUserFragment | null>(null);

export const Layout: React.FC<LayoutProps> = ({ children, variant = "regular" }) => {
    const [currentUser, setCurrentUser] = useState<RegularUserFragment | null>(null);
   
    return (
        <>
            <NavBar setCurrentUser={setCurrentUser} variant={variant} />
            <LoggedContext.Provider value={currentUser}>
                <Wrapper variant={variant}>      
                    {children}
                </Wrapper>
            </LoggedContext.Provider>
        </>
    )
};