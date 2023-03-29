import Button from 'react-bootstrap/Button';
import { useState } from 'react';

function PButton(props:{text:string, onButtonClick?:any, primaryColour?:string, secondaryColour?:string}) {
  const [isHover, setIsHover] = useState(false);

  function handleMouseEnter() {
    setIsHover(true);
  };

  function handleMouseLeave() {
    setIsHover(false);
  };

  const primColour:string = props.primaryColour === undefined ? "#009999" : props.primaryColour;
  const secColour:string = props.secondaryColour === undefined ? "#007e7e" : props.secondaryColour;
  
  const newStyle:any = {
    backgroundColor: isHover ? secColour : primColour,
    borderColor: primColour
  };

  return (
    <>
      <Button style={newStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} size="lg" onClick = {props.onButtonClick}>{props.text}</Button>{' '}
    </>
  );
}

export default PButton;