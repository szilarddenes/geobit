import NextImage from 'next/image';
import { forwardRef } from 'react';

/**
 * A wrapper around Next.js Image component that prevents the fetchPriority warning
 * This works by using a ref and omitting fetchPriority from being passed to the DOM
 */
const CustomImage = forwardRef(function CustomImage(props, ref) {
    const { priority, ...otherProps } = props;

    if (priority) {
        // We still want the performance benefits of priority
        // But we're setting it this way to avoid the prop warning
        return <NextImage ref={ref} {...otherProps} priority />;
    }

    return <NextImage ref={ref} {...otherProps} />;
});

export default CustomImage; 