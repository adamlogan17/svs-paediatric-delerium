import axios from "axios";
import PButton from "../../components/PButton/PButton";

/**
 * Logs a message if authentication is achieved and undefined if authentication is not given
 * @author Adam Logan
 * @date 2023-04-10
 */
function testAuth():void {
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

// this page is used to test RBAC in regards of if the page can be visited and the APIs
const OtherPage = () => {
    return (
        <>
            <h1>Other Page</h1>
            
            <PButton text="Test Auth" primaryColour='#025858' secondaryColour='#013e3e' onButtonClick={()=>testAuth()} />
        </>
    );
};

export default OtherPage;