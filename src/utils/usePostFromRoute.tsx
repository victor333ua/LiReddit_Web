import { useRouter } from "next/router";
import { CombinedError } from "urql";
import { ExtendedPostQuery, useExtendedPostQuery } from "../generated/graphql";

export type UsePostResponse = {
    data: ExtendedPostQuery | undefined,
    fetching: boolean,
    error: CombinedError | undefined,
    intId: number
};

export const usePostFromPageRoute = ():UsePostResponse => {
    const router = useRouter();
    const { id } = router.query;
    const intId = typeof(id) === 'string' ?  parseInt(id) : -1;

    const [{ data, fetching, error }] = useExtendedPostQuery({
        pause: intId === -1,
        variables: { id: intId }
    });

    return { data, fetching, error, intId };
}