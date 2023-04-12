import BasicNavBar from '../../components/NavBar/NavBar';
import PButton from '../../components/PButton/PButton';
import TypeDropDown from '../../components/TypeDropDown/TypeDropDown';

import '../../shared/layout.css';
import './form.css'

function Form() {
  return (
        <div id='form' className='wrapper'>
            <BasicNavBar />
            
            <div className = 'content'>
                <h1>Delirium Compliance - Audit Form</h1>
                <br />

                <form action="" method="get">
                    <div className="data-input">
                    <h5>Select your PICU number from this list: </h5>
                    <TypeDropDown text="Site Number" primaryColour='#025858' secondaryColour='#013e3e' options={Array.from({length: 29}, (_, i) => ("s" + (i + 1)).toString())}/>
                        <br />
                        <h5>Enter your summary value this is an integer in the range 0 to 100 (no spaces): </h5>
                        <input id='summary value' className='entry' type='text' name='summary value'/>

                        <h5>Enter your user id: </h5>
                        <input id='user id' className='entry' type='text' name='user id'/>
                    </div>
                    <PButton text="Submit" onButtonClick = {() => {console.log("Hello World")}} primaryColour='#025858' secondaryColour='#013e3e'/>
                </form>
            </div>
        </div>
  );
}

export default Form;