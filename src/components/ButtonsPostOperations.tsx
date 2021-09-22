import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import router from 'next/router';
import React, { useContext } from 'react'
import { useDeletePostMutation } from '../generated/graphql';
import { UserContext } from './UserProvider';

interface ButtonsPostOperationsProps {
    post: {
        id: number,
        creator: {
            id: number
        }
    }
}

export const ButtonsPostOperations: React.FC<ButtonsPostOperationsProps> = ({ post }) => {
    const [, deletePost] = useDeletePostMutation();
    const { user: currentUser } = useContext(UserContext);

    const isMyPost = post?.creator.id === currentUser?.id;
    return (
        isMyPost ? (
            <Flex ml="auto" align="flex-end">
                 <IconButton
                    aria-label="update"
                    icon={<EditIcon/>}
                    mr={2}
                    onClick={() => {
                      router.push(`/post/edit/${post.id}`)
                    }}
                />    
                <IconButton
                    aria-label="delete"
                    icon={<DeleteIcon />}
                    onClick={async () => {                          
                        await deletePost({ id: post.id });                           
                    }}
                />
            </Flex>
        ) : null
    );
};