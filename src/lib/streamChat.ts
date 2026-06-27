import { StreamChat } from "stream-chat"

const streamChat = new StreamChat(process.env.NEXT_PUBLIC_STREAM_API_KEY ?? "")

export default streamChat
