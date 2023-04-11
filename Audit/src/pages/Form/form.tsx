import BasicNavBar from '../../components/NavBar/NavBar';
import PButton from '../../components/PButton/PButton';

import '../../shared/layout.css';
import './form.css'

function Form() {
  return (
        <div id='form' className='wrapper'>
            <BasicNavBar />
            
            <div className = 'content'>
                <h1> Delirium Compliance - Audit Form</h1>
                <br />

                <form action="" method="get">
                    <div className="data-input">

                    </div>
                    <PButton text="Start" onButtonClick = {() => {console.log("Hello World")}} primaryColour='#025858' secondaryColour='#013e3e'/>
                </form>
            </div>
        </div>
  );
}

export default Form;