'use client'

import { MessageDTO } from '@/types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MessageBox from './MessageBox'
import { pusherClient } from '@/lib/pusher'
import { formatShortDateTime } from '@/lib/util'
import { Channel } from 'pusher-js'
import useMessageStore from '@/hooks/useMessageStore'

type Props = {
    initialMessage: {
        messages: MessageDTO[],
        readCount: number
    }
    currentUserId: string
    chatId: string
}

export default function MessageList({ initialMessage, currentUserId, chatId }: Props) {
    const setReadCount = useRef(false);
    const [messages, setMessages] = useState(initialMessage.messages)
    const { updateUnreadCount } = useMessageStore()

    useEffect(() => {
        if(!setReadCount.current) {
            updateUnreadCount(-initialMessage.readCount)
            setReadCount.current = true
        }
    },[initialMessage.readCount, updateUnreadCount])

    const channelRef = useRef<Channel | null>(null)
    const handleNewMessage = useCallback((message: MessageDTO) => {
        setMessages(prevState => {
            return [...prevState, message]
        })
    }, [])

    const handleReadMessages = useCallback((messageIds: string[]) => {
        setMessages(prevState => prevState.map(message => messageIds.includes(message.id)
            ? {
                ...message,
                dateRead: formatShortDateTime(new Date())
            }
            : message
        ))
    }, [])

    useEffect(() => {
        if (!channelRef.current) {
            channelRef.current = pusherClient.subscribe(chatId)

            channelRef.current.bind('message:new', handleNewMessage)
            channelRef.current.bind('messages:read', handleReadMessages)
        }
        return () => {
            if (channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe()
                channelRef.current.unbind('message:new', handleNewMessage)
                channelRef.current.unbind('messages:read', handleReadMessages)
            }

        }
    }, [chatId, handleNewMessage, handleReadMessages])

    return (
        <div>
            {messages.length === 0 ? 'No messages to display' : (
                <div>
                    {messages.map(message => (
                        <MessageBox
                            key={message.id}
                            message={message}
                            currentUserId={currentUserId} />
                    ))}
                </div>
            )}
        </div>
    )
}
