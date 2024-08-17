import React from 'react'

export default function useScroll(dep) {
    const ref = React.useRef();
    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [dep]);
    return ref;
}