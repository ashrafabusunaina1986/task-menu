import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, disabled, ...props }: InputProps) {
    return (
        <input
            {...props}
            disabled={disabled}
            className={`
                w-full
                rounded-xl
                border
                border-gray-800/80
                bg-[#141423]/60
                px-5
                py-3.5
                text-sm
                text-white
                placeholder:text-gray-600
                outline-none
                transition-all
                duration-150
                focus:border-purple-500/50
                focus:ring-4
                focus:ring-purple-500/10
                disabled:cursor-not-allowed
                disabled:opacity-40
                disabled:bg-gray-900/20
                disabled:border-gray-900
                ${className ?? ""}
            `}
        />
    );
}
