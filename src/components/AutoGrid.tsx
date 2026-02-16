import { ReactNode } from "react";

export function AutoGrid({ children }: { children: ReactNode }) {
    return (
        <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      gap-4
    ">
            {children}
        </div>
    );
}
