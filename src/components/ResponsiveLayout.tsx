import { ReactNode } from "react";

export default function ResponsiveLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen w-full bg-background">
            <div className="
        mx-auto 
        w-full 
        max-w-7xl 
        px-4 sm:px-6 lg:px-8
      ">
                {children}
            </div>
        </div>
    );
}
