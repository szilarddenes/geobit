import NextImage from 'next/image';
import { forwardRef, useEffect, useRef } from 'react';

/**
 * A wrapper around Next.js Image component that prevents the fetchPriority warning
 * by manually handling the DOM element after mounting
 */
const CustomImage = forwardRef(function CustomImage(props, forwardedRef) {
    const { priority, ...otherProps } = props;
    const localRef = useRef(null);

    // Use effect to clean up attributes after the component mounts
    useEffect(() => {
        const ref = forwardedRef || localRef;
        if (ref.current) {
            // If the image element has fetchPriority attribute, remove it
            if (ref.current.hasAttribute('fetchPriority')) {
                ref.current.removeAttribute('fetchPriority');
            }

            // Optionally add the lowercase version if needed for priority
            if (priority) {
                ref.current.setAttribute('fetchpriority', 'high');
            }
        }
    }, [forwardedRef, priority]);

    // Return the NextImage with appropriate props
    return (
        <NextImage
            ref={forwardedRef || localRef}
            {...otherProps}
            // We use loading='eager' instead of priority to get similar behavior
            loading={priority ? 'eager' : 'lazy'}
        />
    );
});

export default CustomImage; 