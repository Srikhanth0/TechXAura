import React from "react";

export function Title({ children }: { children: React.ReactNode }) {
    return (
        <h1 className="
      text-xl 
      sm:text-2xl 
      md:text-3xl 
      font-bold
    ">
            {children}
        </h1>
    );
}

export function Body({ children }: { children: React.ReactNode }) {
    return (
        <p className="
      text-sm 
      sm:text-base 
      text-gray-600
    ">
            {children}
        </p>
    );
}
