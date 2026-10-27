// components/ui/Button.tsx

import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, disabled, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`
                w-full
                py-3
                px-5
                rounded-xl
                font-bold
                text-xs
                uppercase
                tracking-wider
                text-white
                bg-gradient-to-r
                from-purple-600
                to-blue-600
                shadow-lg
                shadow-purple-600/10
                transition-all
                duration-150
                outline-none
                cursor-pointer
                hover:from-purple-500
                hover:to-blue-500
                hover:shadow-purple-500/20
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-40
                disabled:hover:from-purple-600
                disabled:hover:to-blue-600
                disabled:hover:shadow-none
                disabled:active:scale-100
                ${className ?? ""}
            `}
        />
    );
}
