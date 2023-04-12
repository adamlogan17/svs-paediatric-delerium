import { useState } from 'react';

function useHover() {
    const [isHover, setIsHover] = useState(false);
    
    return {
        hoverVar: isHover,
        mouseEnter: () => setIsHover(true),
        mouseLeave: () => setIsHover(false)
    };
}

export default useHover;