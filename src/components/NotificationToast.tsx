import { transformImageUrl } from '@/lib/util'
import Link from 'next/link'
import React from 'react'
import { Image } from '@nextui-org/react'
import { toast } from 'react-toastify'
import { MessageDTO } from '@/types'

type Props = {
    image?: string | null;
    href: string;
    title: string;
    subtitle?: string
}

export default function NotificationToast({ image, href, title, subtitle }: Props) {

    return (
        <Link href={href} className='flex item-center'>
            <div className='mr-2'>
                <Image
                    src={transformImageUrl(image) || '/images/user.png'}
                    height={50}
                    width={50}
                    alt='Sender image'
                />
            </div>
            <div className='flex flex-grow flex-col justify-center'>
                <div className='font-semibold'>
                    {title}
                </div>
                <div className='text-sm'>
                    {subtitle || 'Click to view'}
                </div>
            </div>
        </Link>
    )

}

export const newMessageToast = (message: MessageDTO) => {
    toast(<NotificationToast
        image={message.senderImage}
        href={`/members/${message.senderId}/chat`}
        title={`${message.senderName} has sent you a message`}
    />)
}

export const newLikeToast = (name: string, image: string | null, userId: string) => {
    toast(<NotificationToast
        image={image}
        href={`/members/${userId}`}
        title={`You have been liked by ${name}`}
        subtitle='Click here to view their profile'
    />)
}