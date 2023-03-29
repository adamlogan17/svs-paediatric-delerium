import React, { ForwardedRef } from 'react';
import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

const filter:ForwardedRef<Dropdown> = React.forwardRef((props:{ children:any, style:any, className:any }) => {
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

function TypeDropDown() {
  return (
    <Dropdown>
      <Dropdown.Toggle>
        Pick Site Number
      </Dropdown.Toggle>

      <Dropdown.Menu as={filter}>
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default TypeDropDown;