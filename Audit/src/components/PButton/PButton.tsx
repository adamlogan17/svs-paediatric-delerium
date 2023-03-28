import Button from 'react-bootstrap/Button';

function PButton(props:{text:string, onButtonClick?:any}) {
  return (
    <>
      <Button variant="primary" size="lg" onClick = {props.onButtonClick}>{props.text}</Button>{' '}

    </>
  );
}

export default PButton;