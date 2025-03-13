import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ClientOnlyPortal({ children, selector }) {
    const ref = useRef();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // This runs on the client only, avoiding the useLayoutEffect warning
        setMounted(true);
        ref.current = document.querySelector(selector) || document.body;
        return () => {
            setMounted(false);
        };
    }, [selector]);

    // Only render on the client, not during server-side rendering
    return mounted ? createPortal(children, ref.current) : null;
} 