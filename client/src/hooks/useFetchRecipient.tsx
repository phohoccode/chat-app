import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat: any, user: any) => {
    const [recipientUser , setRecipientUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const recipientId = chat?.members?.find((member: any) => member !== user._id);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return null;

            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

            if (response.error) {
                return setError(response.error);
            }
            
            setRecipientUser(response);
        }

        getUser();
    }, [recipientId])

    return { recipientUser, error };
};

export default useFetchRecipientUser;
