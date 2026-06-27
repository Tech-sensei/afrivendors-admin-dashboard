"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, Send, X } from "lucide-react"
import type { QueryChannelAPIResponse } from "stream-chat"
import { toast } from "sonner"
import useStreamChat from "@/hooks/useStreamChat"
import streamChat from "@/lib/streamChat"

function formatMessageTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

export function AdminMessageDrawerBody({
  channelId,
  title,
  subtitle,
  onClose,
}: {
  channelId: string
  title: string
  subtitle: string
  onClose: () => void
}) {
  const [inputText, setInputText] = useState("")
  const [conversation, setConversation] = useState<QueryChannelAPIResponse | null>(null)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { getChannelMessages, sendMessage } = useStreamChat()

  useEffect(() => {
    let cancelled = false
    void getChannelMessages(channelId)
      .then((response) => {
        if (!cancelled) setConversation(response)
      })
      .catch(() => {
        if (!cancelled) toast.error("Could not load messages")
      })
    return () => {
      cancelled = true
    }
  }, [channelId, getChannelMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation?.messages?.length])

  const handleSend = async () => {
    const text = inputText.trim()
    if (!text) return
    setIsSending(true)
    try {
      await sendMessage(channelId, text)
      setInputText("")
      const response = await getChannelMessages(channelId)
      setConversation(response)
    } catch {
      toast.error("Could not send message")
    } finally {
      setIsSending(false)
    }
  }

  const messages = conversation?.messages ?? []

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-border bg-white px-4 py-4">
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border hover:bg-secondary-800"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <p className="truncate font-unbounded text-base font-semibold text-secondary-000">{title}</p>
          <p className="truncate font-unageo text-xs text-accent-70">{subtitle}</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-secondary-800/40 p-4">
        {messages.length === 0 ? (
          <p className="rounded-xl border border-border bg-white px-4 py-6 text-center font-unageo text-sm text-accent-70">
            No messages yet. Send the first message below.
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const isMine = message.user?.id === streamChat.userID
              return (
                <div
                  key={message.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 font-unageo text-sm ${
                      isMine
                        ? "bg-primary-100 text-white"
                        : "border border-border bg-white text-secondary-000"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p
                      className={`mt-1 text-[11px] ${isMine ? "text-white/70" : "text-accent-70"}`}
                    >
                      {formatMessageTime(message.created_at ?? new Date())}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border bg-white p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message…"
            rows={1}
            className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-border px-3 py-2.5 font-unageo text-sm outline-none focus:border-primary-100"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                void handleSend()
              }
            }}
          />
          <button
            type="button"
            disabled={isSending || !inputText.trim()}
            onClick={() => void handleSend()}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-white disabled:opacity-50"
            aria-label="Send message"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
