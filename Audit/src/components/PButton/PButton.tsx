import Button from 'react-bootstrap/Button';
import useHover from '../../hooks/useAPI/useHover';

function PButton(props:{text:string, onButtonClick?:any, primaryColour?:string, secondaryColour?:string, textColor?:string}) {
  const checkHover = useHover();

  const primColour:string = props.primaryColour === undefined ? "#009999" : props.primaryColour;
  const secColour:string = props.secondaryColour === undefined ? "#007e7e" : props.secondaryColour;
  
  const newStyle:any = {
    backgroundColor: checkHover.hoverVar ? secColour : primColour,
    borderColor: primColour,
    color: props.textColor
  };

  return (
    <>
      <Button style={newStyle} onMouseEnter={checkHover.mouseEnter} onMouseLeave={checkHover.mouseLeave} size="lg" onClick = {props.onButtonClick}>{props.text}</Button>{' '}
    </>
  );
}

export default PButton;