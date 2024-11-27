import { CardHeader, CardBody, Divider } from '@nextui-org/react'
import React from 'react'

export default function ChatPage() {
    return (
        <>
            <CardHeader className='text-2xl font-semibold text-secondary'>
                Profile
            </CardHeader>
            <Divider />
            <CardBody>
                chat goes here
            </CardBody>
        </>
    )
}
