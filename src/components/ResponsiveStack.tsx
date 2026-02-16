import { ReactNode } from "react";

export function ResponsiveStack({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`
        flex flex-col 
        md:flex-row 
        gap-4 md:gap-6 
        ${className}
      `}
        >
            {children}
        </div>
    );
}
