import useGetAPI from "../../hooks/useAPI/useAPI";

function ConsumeAPI() {
    // can't get it to get my local API, think this is might be an issue with the fact that they are both running on localhost
    const posts = useGetAPI([], "https://jsonplaceholder.typicode.com/posts?_limit=10");

    return (
        <div className="api-output-container">
            {posts.map((post: any) => (
                <div key={post.id}>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                </div>
            ))}
        </div>
    );
};

export default ConsumeAPI;