import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import http from "@/lib/http"

export function useStreamChatToken() {
  return useQuery({
    queryKey: ["stream-chat-token"],
    queryFn: async () => {
      const { data } = await http.get("/messages/stream-chat-token")
      return data as { userChatToken?: string }
    },
  })
}

export function useCreateStreamChatChannel() {
  return useMutation({
    mutationFn: async (payload: {
      otherUserId: number
      appointmentId?: number
      customRequestId?: number
    }) => {
      const { data } = await http.post("/messages/create-channel", payload)
      return data
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to create chat channel. Please try again.",
      )
    },
  })
}
