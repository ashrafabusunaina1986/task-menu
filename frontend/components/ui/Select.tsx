// components/ui/Select.tsx

import { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement>


export default function Select(props: Props) {
    return (
        <select
            {...props}
            className={`
        w-full
        rounded-xl
        border border-white/10
        bg-zinc-900 px-4 py-3
        text-white
        outline-none
        focus:border-violet-500
        ${props.className ?? ""}
        `}
        />
    )
}
