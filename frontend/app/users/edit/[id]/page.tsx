// app/users/edit/[id]/page.tsx

import EditUser from "@/components/user/EditUser";

interface Props {
    params: Promise<{
        id: string
    }>
}


export default async function EditUserPage({ params }: Props) {
    const { id } = await params
    return <EditUser id={id} />
}
