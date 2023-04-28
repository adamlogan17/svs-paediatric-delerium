
/**
 * Displays a heading
 * @author Adam Logan
 * @date 2023-04-28
 * @param { {text:string} } props
 * @prop { string } text The text to display
 */
function HeadingText(props:{text:string}) {
    return (
        <h2>
            <u>{props.text}</u>
        </h2>
    )
};

export default HeadingText;