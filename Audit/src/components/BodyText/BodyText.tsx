/**
 * Represents the body of text
 * @author Adam Logan
 * @date 2023-04-28
 * @param { {text:string} } props
 * @prop {string} text The text to be displayed
 */
function BodyText(props:{text:string}) {
    return (
        <p>
            <b>{props.text}</b>
        </p>
    )
};

export default BodyText;