import { useEffect, useState } from "react";
import useGetAPI from "../hooks/useAPI/useAPI";
import PButton from "./PButton/PButton";
import axios from "axios";

function ConsumeAPI() {
    // can't get it to get my local API, think this is might be an issue with the fact that they are both running on localhost
    // const posts = useGetAPI([], "https://jsonplaceholder.typicode.com/posts?_limit=10");
    // const posts = useGetAPI([], "http://localhost:8000/chartData/singleSite/1");
    // console.log(posts);

    const [posts, setPosts] = useState({
        entryDates: ['2023-04-13T00:00:00.000Z'], complianceScore:[0]
    });

    useEffect(() => {
        const fetchPost = async () => {
            const configuration = {
                    method: "get",
                    url: "http://localhost:8000/chartData/singleSite/1"
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
    }, []);


    let x = "hello"

    return (
        <div className="api-output-container">
            {/* < PButton text="hello" onButtonClick={() => {
                alert(posts.entryDates[0]);
            }}/> */}
            {posts.entryDates[1]}
        </div>
    );
};

export default ConsumeAPI;
