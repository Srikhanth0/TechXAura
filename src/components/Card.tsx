import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
    return (
        <div className="
      w-full
      rounded-xl
      bg-white
      shadow-sm
      p-4 sm:p-6
      overflow-hidden
    ">
            {children}
        </div>
    );
}
