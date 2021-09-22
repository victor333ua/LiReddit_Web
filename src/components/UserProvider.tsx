import React, { createContext, useState } from 'react'
import { RegularUserFragment } from '../generated/graphql';

export type User = RegularUserFragment | null;

export const UserContext =
   createContext<{
        user: User;
        setUser: (user: User) => void
    }>({ user: null, setUser: () =>{} });
   

export const UserProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<User>(null);
   
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

