import axios from 'axios';
import { useState, useEffect } from 'react';

function useGetAPI(defaultValue: any, url: string) {
    const [posts, setPosts] = useState(defaultValue);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                let response = await axios.get(url);
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