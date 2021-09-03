import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { CombinedError } from "urql";
import { Layout } from "./Layout";

interface ServerErrorProps {
    error: CombinedError | undefined
}

export const ServerError: React.FC<ServerErrorProps> = ({ error }) => (
    <Layout>
            <Box>
                <Heading>Server Error</Heading>
                <Text mt={4}>
                    {error ? error.message : "No data"}
                </Text>
            </Box>
    </Layout>
);




    