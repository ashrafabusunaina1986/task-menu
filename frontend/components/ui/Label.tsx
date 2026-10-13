// components/ui/Label.tsx

import { LabelHTMLAttributes } from "react"

type Props = LabelHTMLAttributes<HTMLLabelElement>

export default function Label(props: Props) {
    return (
        <label
            {...props}
            className={`
        mb-2 block text-sm text-gray-300
        ${props.className ?? ""}
        `}
        />
    )
}
