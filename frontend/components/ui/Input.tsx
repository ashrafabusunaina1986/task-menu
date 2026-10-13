import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: Props) {
    return (
        <input
            {...props}
            className={`
                w-full
                rounded-xl
                border border-white/10
                bg-zinc-900
                px-5 py-3
                text-white
                outline-none
                focus:border-violet-500
                ${props.className ?? ""}
            `}
        />
    );
}