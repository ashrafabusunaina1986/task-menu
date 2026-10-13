// components/ui/Button.tsx

import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>


export default function Button(props: Props) {
    return (
        <button
            {...props}
            className={`rounded-xl bg-gradient-to-r from-blue-600
            to-violet-600 py-3 font-semibold text-white
            transition hover:scale-[1.02] disabled:cursor-not-allowed
            disabled:opacity-50
            ${props.className ?? ""}
            `}
        />
    )
}
