import { Box, Button, Flex, IconButton, Link } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';
import NextLink from 'next/link'
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { WrapperVariant } from './Wrapper';
import { User, UserContext } from './UserProvider';

interface NavbarProps {
    variant?:  WrapperVariant ;
}

const NavBar: React.FC<NavbarProps> = ({ variant }) => {
    const [{ data, fetching }] = useMeQuery();    
    const [{fetching: logoutFetching}, logout] = useLogoutMutation();

    const { setUser } = useContext(UserContext);

    let body = null;
    let currentUser: User = null;

    useEffect(() => {
        currentUser && setUser(currentUser);
    }, [currentUser])

    if(fetching) {

    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={2}>login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link mr={2}>register</Link>
                </NextLink>
            </>                                 
        )
    } else {
        body = (
            <Flex align="center">
                <NextLink href="/create-post">
                    <Button
                        mr={10}
                        bg="gray.300"
                        border="2px" 
                        borderColor="gray.600"
                    >
                        create post
                    </Button>
                </NextLink>
                <Box mr={2}>{data.me.username}</Box>
                <Button 
                    mr={2}
                    variant="link"
                    isLoading={logoutFetching}
                    onClick={() => logout()}
                >
                    logout
                </Button>
            </Flex>                     
        )
        currentUser = data.me;
    }
        return (
            <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
                <Flex flex={1} mx="auto" maxW={variant === 'regular' ? "800px" : "400px"}>
                    <NextLink href="/">
                        <IconButton
                            aria-label="home"
                            icon={<ExternalLinkIcon/>}
                            bg="gray.300"
                            border="2px"
                            borderColor="gray.600"
                            size="md"
                        />                     
                    </NextLink>
                    <Box ml="auto">
                        {body}
                    </Box>
                </Flex>
            </Flex>
        );
};
export default NavBar;