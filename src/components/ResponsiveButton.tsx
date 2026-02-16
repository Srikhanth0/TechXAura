import React from "react";

export function ResponsiveButton({
    label,
    onClick,
}: {
    label: string;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="
        w-full sm:w-auto
        px-4 py-2
        text-sm sm:text-base
        rounded-lg
        bg-black text-white
        active:scale-[0.98]
      "
        >
            {label}
        </button>
    );
}
