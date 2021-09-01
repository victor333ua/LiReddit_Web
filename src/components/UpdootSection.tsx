import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
    // post: PostsQuery["posts"]["posts"][0]
    post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [, vote] = useVoteMutation();
    const [loadingState, setLoadingState] = useState<
        "up-loading" | "down-loading" | "not-loading"
    >("not-loading");

    return (
        <Flex flexDirection="column"  mr={6} textAlign="center">
            <IconButton
                aria-label="up"
                icon={<ChevronUpIcon />}
                onClick={async () => {
                    if (post.voteValue === 1) return;
                    setLoadingState("up-loading");
                    await vote({value: 1, postId: post.id});
                    setLoadingState("not-loading");
                }}
                isLoading={loadingState === "up-loading"}
                colorScheme={post.voteValue === 1 ? "green" : undefined}
            />
                {post.points}
            <IconButton
                aria-label="down"
                icon={<ChevronDownIcon />}
                onClick={async () => {
                    if (post.voteValue === -1) return;
                    setLoadingState("down-loading");
                    await vote({value: -1, postId: post.id});
                    setLoadingState("not-loading");
                }}
                isLoading={loadingState === "down-loading"}
                colorScheme={post.voteValue === -1 ? "red" : undefined}
            />           
        </Flex>
    );
}