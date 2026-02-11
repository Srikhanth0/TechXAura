"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const LaserCanvas = dynamic(() => import('./LaserCanvas'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-transparent" />
});

type Props = React.ComponentProps<typeof LaserCanvas> & {
    className?: string;
    style?: React.CSSProperties;
};

export default function LaserFlow({ className, style, ...props }: Props) {
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        // Preload after LCP/interaction or small delay to prioritize main content
        const timer = setTimeout(() => {
            setShouldLoad(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`relative ${className || ''}`} style={style}>
            {shouldLoad ? <LaserCanvas {...props} /> : null}
        </div>
    );
}
