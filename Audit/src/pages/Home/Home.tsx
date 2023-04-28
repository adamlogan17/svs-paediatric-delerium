import BasicNavBar from '../../components/NavBar/NavBar';
import HeadingText from '../../components/HeadingText/HeadingText'
import BodyText from '../../components/BodyText/BodyText'
import PButton from '../../components/PButton/PButton'
import ContactInfo from '../../components/ContactInfo/ContactInfo'

import '../../shared/layout.css';



/**
 * This is the landing page of the site
 * @author Adam Logan
 * @date 2023-04-28
 */
function Home() {
  return (
        <div id='home' className='wrapper'>
          
          <BasicNavBar />
          <div className = 'content'>
            <div className = 'row' id = 'UpperTextContainer'>
              <div className='col'>
                <HeadingText text = "Audit & Feedback"/>
                <BodyText text = 'Thank you for your interest in auditing the delirium screening practice in your unit. We have developed audit tools to accommodate units who use either the CAPD or SOSPD screening tools. Please follow the link to access and download the audit material most appropriate to your unit.'/>
              </div>
            </div>

            <div className = 'row' id = 'ButtonContainer'>
              <div className = 'half-column' id = 'SOSPD-ButtonColumn'>
                <PButton text = 'SOSPD Audit Section' onButtonClick = {() => {window.location.href = "/form"}}/>
              </div>
              <div className = 'half-column' id = 'CAPD-ButtonColumn'>
                <PButton text = 'CAPD Audit Section' onButtonClick = {() => {window.location.href = "/form"}}/>
              </div>
            </div>

            <div className = 'row' id = 'ContactInfoContainer'>
              <ContactInfo />
            </div>
          </div>
        </div>
  );
}

export default Home;
