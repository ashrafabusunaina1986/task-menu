// components/ui/Label.tsx

import { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({ className, ...props }: LabelProps) {
    return (
        <label
            {...props}
            className={`
                block
                text-[11px]
                font-bold
                text-gray-400
                uppercase
                tracking-wider
                select-none
                ${className ?? ""}
            `}
        />
    );
}
