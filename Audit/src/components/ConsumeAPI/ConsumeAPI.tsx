import useGetAPI from "../../hooks/useAPI/useAPI";


/**
 * Displays the output of an API
 * @author Adam Logan
 * @date 2023-04-28
 * ! Not used within the app itself but for testing
 */
function ConsumeAPI() {
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