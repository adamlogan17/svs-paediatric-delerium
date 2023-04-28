import Button from 'react-bootstrap/Button';
import useHover from '../../hooks/useAPI/useHover';

/**
 * The main button component to be used site wide
 * @author Adam Logan
 * @date 2023-04-28
 * @param { {text:string, onButtonClick?:any, primaryColour?:string, secondaryColour?:string, textColor?:string, width?:string} } props
 * @prop { string } text The text to be displayed on the function
 * @prop { any } [onButtonClick] The function which is called when the button is clicked
 * @prop { sting } [primaryColour] The background hex code of the button (default is "#009999")
 * @prop { sting } [primaryColour] The background hex code of the button when a mouse hovers over the button (default is "#007e7e")
 * @prop { string } [textColor] The hex code of the text
 * @prop { string } [width] The width of the button
 */
function PButton(props:{text:string, onButtonClick?:any, primaryColour?:string, secondaryColour?:string, textColor?:string, width?:string}) {
  const checkHover = useHover();

  const primColour:string = props.primaryColour === undefined ? "#009999" : props.primaryColour;
  const secColour:string = props.secondaryColour === undefined ? "#007e7e" : props.secondaryColour;
  
  const newStyle:any = {
    backgroundColor: checkHover.hoverVar ? secColour : primColour,
    borderColor: primColour,
    color: props.textColor,
    width: props.width
  };

  return (
    <>
      <Button style={newStyle} onMouseEnter={checkHover.mouseEnter} onMouseLeave={checkHover.mouseLeave} size="lg" onClick = {props.onButtonClick}>{props.text}</Button>{' '}
    </>
  );
}

export default PButton;
