/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef } from "react"
import usePresenceStore from "./usePresenceStore"
import { Channel, Members } from "pusher-js"
import { pusherClient } from "@/lib/pusher"

export const usePresenceChannel = () => {
    const { set, add, remove } = usePresenceStore()

    const channelRef = useRef<Channel | null>(null)

    const handleSetMember = useCallback((memberIds: string[]) => {
        set(memberIds)
    }, [set])

    const handleAddMember = useCallback((memberId: string) => {
        add(memberId)
    }, [add])

    const handleRemoveMember = useCallback((memberId: string) => {
        remove(memberId)
    }, [remove])

    useEffect(() => {
        if (!channelRef.current) {
            channelRef.current = pusherClient.subscribe('presence-nm')

            channelRef.current?.bind('pusher:subscription_succeeded', (members: Members) => {
                handleSetMember(Object.keys(members.members))
            })

            channelRef.current?.bind('pusher:member_added', (member: Record<string, any>) => {
                handleAddMember(member.id)
            })

            channelRef.current?.bind('pusher:member_removed', (member: Record<string, any>) => {
                handleRemoveMember(member.id)
            })
        }

        return () => {
            if(channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind('pusher:subscription_succeeded', handleSetMember);
                channelRef.current.unbind('pusher:member_added', handleAddMember);
                channelRef.current.unbind('pusher:member_removed', handleRemoveMember);
            }
        }
    }, [handleAddMember, handleRemoveMember, handleSetMember])
}