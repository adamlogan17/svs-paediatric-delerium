import axios from "axios";
import PButton from "../../components/PButton/PButton";

function testAuth() {
    const configuration = {
        method: "get",
        url: "http://localhost:8000/test-auth",
        headers: { 'Authorization': "bearer " + sessionStorage.getItem('TOKEN') } 
    };
    
    // make the API call
    axios(configuration)
        .then((result) => {
            // sets the cookies
            console.log(result.data.message);
        })
        .catch((error) => error = new Error());
}

const OtherPage = () => {
    return (
        <>
            <h1>Page</h1>
            
            <PButton text="Test Auth" primaryColour='#025858' secondaryColour='#013e3e' onButtonClick={()=>testAuth()} />
        </>
    );
};

export default OtherPage;