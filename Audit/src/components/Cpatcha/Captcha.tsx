import { Component, RefObject } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import PageLoad from '../Loading/PageLoad';

/**
 * Represents the props for the Captcha component.
 * 
 * @author Adam Logan
 * 
 * @typedef {Object} CaptchaProps
 * @property {RefObject<ReCAPTCHA>} captchaRef - A reference to the ReCAPTCHA component.
 */
type CaptchaProps = {
  captchaRef: RefObject<ReCAPTCHA>;
}

/**
 * Represents the state for the Captcha component.
 * 
 * @author Adam Logan
 * 
 * @typedef {Object} CaptchaState
 * @property {boolean} isLoading - A boolean indicating whether the component is currently loading.
 */
type CaptchaState = {
  isLoading: boolean;
}

/**
 * A React component that renders a Google reCAPTCHA widget.
 * 
 * The reason why this is a class is to ensure the loading animation only stops when the component has mounted
 * 
 * @author Adam Logan
 * 
 * @class Captcha
 * @extends {Component<CaptchaProps, CaptchaState>}
 */
class Captcha extends Component<CaptchaProps, CaptchaState> {
  constructor(props:CaptchaProps) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.setState({isLoading:false});
  }
  
  render() {
    return (
      <>
        <PageLoad loading={this.state.isLoading}/>

        {/* @see {@link https://stackoverflow.com/questions/57639200/google-recaptcha-component-with-dynamic-theme-value-next-js} on how to change the theme without refreshing the page */}
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY ? process.env.REACT_APP_CAPTCHA_SITE_KEY : ""}
          ref={this.props.captchaRef}
          // onChange={(value) => {console.log("val", value)} }  // this can also be used, instead of using ref, although a state, will need to be added as well as the disadvantage of not being able to reset the captcha
        />
      </>
    )
  };
}

export default Captcha;