import { Box, Button, Flex, IconButton, Link } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction } from 'react';
import NextLink from 'next/link'
import { useMeQuery, useLogoutMutation, RegularUserFragment } from '../generated/graphql';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Wrapper, WrapperVariant } from './Wrapper';

interface NavbarProps {
    setCurrentUser: Dispatch<SetStateAction<RegularUserFragment | null>>;
    variant?:  WrapperVariant 
}

const NavBar: React.FC<NavbarProps> = ({ setCurrentUser, variant }) => {
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
        setCurrentUser(null);
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
                    variant="link"
                    isLoading={logoutFetching}
                    onClick={() => logout()}
                >
                    logout
                </Button>
            </Flex>                     
        )
        setCurrentUser(data.me);
    }
        return (
            <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
                <Flex flex={1} mx="auto" maxW={variant === 'regular' ? "800px" : "400px"}>
                    <NextLink href="/">
                        <IconButton
                            aria-label="home"
                            icon={<ExternalLinkIcon/>}
                            ml={4}
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
}
export default NavBar;