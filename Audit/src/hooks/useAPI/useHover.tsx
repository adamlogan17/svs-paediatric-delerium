import { useState } from 'react';

/**
 * Checks if the mouse is over the component
 * @author Adam Logan
 * @date 2023-04-28
 */
function useHover() {
    const [isHover, setIsHover] = useState(false);
    
    return {
        hoverVar: isHover,
        mouseEnter: () => setIsHover(true),
        mouseLeave: () => setIsHover(false)
    };
}

export default useHover;