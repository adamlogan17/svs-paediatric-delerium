import axios from 'axios';
import { useState, useEffect } from 'react';

/**
 * A custom hook which calls a GET API and returns the result to the user
 * @author Adam Logan
 * @date 2023-04-28
 * @param { any } defaultValue The default value for the hook
 * @param { string } url The URL of the API to be calles
 */
function useGetAPI(defaultValue: any, url: string) {
    const [posts, setPosts] = useState(defaultValue);

    useEffect(() => {
        const fetchPost = async () => {
            const configuration = {
                    method: "get",
                    url: url
                };
            try {
                let response = await axios(configuration);
                console.log(response);
                setPosts(response.data);
            } catch (err:any) {
                console.log(err);
            }
        };
        fetchPost();
    }, [url]);
    
    return posts;
}

export default useGetAPI;