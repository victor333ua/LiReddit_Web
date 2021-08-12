import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link'
import { useMeQuery } from '../generated/graphql';
import { useLogoutMutation } from './../generated/graphql';

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({}) => {
    const [{ data, fetching }] = useMeQuery();
    const [{fetching: logoutFetching}, logout] = useLogoutMutation();
    let body = null;

    if(fetching) {

    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={2}>login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link>register</Link>
                </NextLink>
            </>                     
        )
    } else {
        body = (
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                <Button 
                    variant="link"
                    isLoading={logoutFetching}
                    onClick={() => logout()}
                >
                    logout
                </Button>
            </Flex>
        )
    }
        return (
            <Flex bg="tan" p={4}>
               <Box ml="auto">
                  {body}
               </Box>
            </Flex>
        );
}