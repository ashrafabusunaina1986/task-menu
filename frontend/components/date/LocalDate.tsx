// components/date/LocalDate.tsx

'use client'

interface PropsDate {
    date: string
}

export default function LocalDate({ date }: PropsDate) {
    return (
        <span>
            {formatDate(date)}
        </span>
    )
}
function formatDate(date: string) {
    return new Date(date).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
    })
}