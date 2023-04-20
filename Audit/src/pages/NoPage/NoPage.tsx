import './NoPage.css';

const NoPage = () => {
    return (
        <div className="no-page">
            <h1 className = "number"> 404 </h1> 
            <br />
            <p className="text"> 
                <span> Ooops... </span>
                <br /> 
                page not found
            </p>
        </div>
    );
};

export default NoPage;