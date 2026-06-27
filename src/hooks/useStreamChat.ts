import { useCallback } from "react"
import streamChat from "@/lib/streamChat"

const useStreamChat = () => {
  const instantiateUser = useCallback(
    async (
      userId: string | number,
      userName: string,
      userImage: string,
      userToken: string,
    ) => {
      const nextId = String(userId)
      if (streamChat.userID && String(streamChat.userID) === nextId) return
      if (streamChat.userID && String(streamChat.userID) !== nextId) {
        await streamChat.disconnectUser()
      }
      await streamChat.connectUser(
        {
          id: nextId,
          name: userName,
          image: userImage,
        },
        userToken,
      )
    },
    [],
  )

  const checkIfChannelExists = useCallback(async (channelId: string) => {
    const channels = await streamChat.queryChannels({
      type: "messaging",
      id: channelId,
    })
    return channels.length > 0
  }, [])

  const getChannelMessages = useCallback(async (channelId: string) => {
    const channel = streamChat.channel("messaging", channelId)
    const response = await channel.query({
      watch: true,
      state: true,
      presence: true,
      messages: {
        limit: 1000,
        offset: 0,
      },
    })
    await channel.markRead()
    return response
  }, [])

  const sendMessage = useCallback(async (channelId: string, message: string) => {
    const channel = streamChat.channel("messaging", channelId)
    await channel.sendMessage({ text: message })
  }, [])

  return {
    instantiateUser,
    checkIfChannelExists,
    getChannelMessages,
    sendMessage,
  }
}

export default useStreamChat
