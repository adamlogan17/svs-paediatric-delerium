function ProtectedRoute(props:{text:string}) {
    return (
        <p>
            <b>{props.text}</b>
        </p>
    )
};

export default ProtectedRoute;