import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link'
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavbarProps {
}

const NavBar: React.FC<NavbarProps> = ({}) => {
    const [{ data, fetching }] = useMeQuery({
        pause: isServer()
    });
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
            <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
               <Box ml="auto">
                  {body}
               </Box>
            </Flex>
        );
}
export default NavBar;