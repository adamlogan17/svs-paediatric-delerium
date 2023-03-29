import Button from 'react-bootstrap/Button';
import './PButton.css';

function PButton(props:{text:string, onButtonClick?:any}) {
  return (
    <>
      <Button id = "test" size="lg" onClick = {props.onButtonClick}>{props.text}</Button>{' '}

    </>
  );
}

export default PButton;