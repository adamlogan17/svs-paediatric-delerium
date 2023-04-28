import React from 'react';
import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import useHover from '../../hooks/useAPI/useHover';

const Filter = React.forwardRef((props:{ children:any, style:any, className:any }, ref) => {
    const [value, setValue] = useState('');
    
    return (
        <div style={props.style} className={props.className}>
            <Form.Control
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e:any) => setValue(e.target.value)}
            value={value}
            />
            
            <ul className="list-unstyled">
                {React.Children.toArray(props.children).filter(
                    (child:any) => !value || child.props.children.toLowerCase().startsWith(value),
                )}
            </ul>

        </div>
    );
},);

/**
 * A dropdown compinent 
 * @author Adam Logan
 * @date 2023-04-28
 * @param { {text:string, options:string[], onButtonClick?:any, primaryColour?:string, secondaryColour?:string, textColor?:string} } props
 * @prop { string } text The text to be displayed on the dropdown button
 * @prop { string[] } options The selectable options of the dropdown
 * @prop { any } [onButtonClick] The function which is called when the button is clicked
 * @prop { sting } [primaryColour] The background hex code of the button (default is "#025858")
 * @prop { sting } [primaryColour] The background hex code of the button when a mouse hovers over the button (default is "#007e7e")
 * @prop { string } [textColor] The hex code of the text
 * @prop { string } [width] The width of the button
 * TODO Add a way for a action to occur when an option is selected
 */
function TypeDropDown(props:{text:string, options:string[], onButtonClick?:any, primaryColour?:string, secondaryColour?:string, textColor?:string}) {
    const checkHover = useHover();

    const primColour:string = props.primaryColour === undefined ? "#025858" : props.primaryColour;
    const secColour:string = props.secondaryColour === undefined ? "#007e7e" : props.secondaryColour;
    
    const bgColours:any = {
        backgroundColor: checkHover.hoverVar ? secColour : primColour,
        borderColor: primColour,
        color: props.textColor
    };

    return (
        <Dropdown>
            <Dropdown.Toggle style={bgColours} onMouseEnter={checkHover.mouseEnter} onMouseLeave={checkHover.mouseLeave}>
                {props.text + ' '}
            </Dropdown.Toggle>

            <Dropdown.Menu as={Filter}>
                {props.options.map((option) => (
                    <Dropdown.Item href="#/action-1">{option}</Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default TypeDropDown;