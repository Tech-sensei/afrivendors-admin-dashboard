"use client"

import { useEffect, useState } from "react"
import { Loader2, X } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useAppSelector } from "@/store/hooks"
import { getCustomRequestChannelId } from "@/lib/customRequestChannel"
import useStreamChat from "@/hooks/useStreamChat"
import {
  useCreateStreamChatChannel,
  useStreamChatToken,
} from "@/services/useStreamChat"
import type { RfsRequest } from "@/components/rfsManagement/data"
import { AdminMessageDrawerBody } from "./AdminMessageDrawerBody"

export type AdminMessageTarget = "customer" | "vendor"

export function AdminCustomRequestMessageDrawer({
  request,
  target,
  isOpen,
  onClose,
}: {
  request: RfsRequest | null
  target: AdminMessageTarget | null
  isOpen: boolean
  onClose: () => void
}) {
  const profile = useAppSelector((s) => s.auth.profile)
  const { data: streamToken } = useStreamChatToken()
  const { mutate: createChannel, isPending: isCreatingChannel } = useCreateStreamChatChannel()
  const { instantiateUser, checkIfChannelExists } = useStreamChat()

  const [streamReady, setStreamReady] = useState(false)
  const [channelExists, setChannelExists] = useState<boolean | null>(null)
  const [channelRecheckKey, setChannelRecheckKey] = useState(0)

  const otherUserId =
    target === "customer"
      ? request?.customerUserId
      : target === "vendor"
        ? request?.vendorUserId
        : null

  const channelId = request ? getCustomRequestChannelId(request.id) : ""
  const contactName =
    target === "customer" ? request?.customerName : target === "vendor" ? request?.vendorName : ""
  const subtitle = request?.title ?? "Custom request"

  useEffect(() => {
    if (!isOpen || !request || !profile?.admin) {
      setStreamReady(false)
      setChannelExists(null)
      return undefined
    }

    const token = streamToken?.userChatToken
    if (!token) {
      setStreamReady(false)
      setChannelExists(null)
      return undefined
    }

    let cancelled = false
    setStreamReady(false)

    const adminName =
      `${profile.admin.firstName ?? ""} ${profile.admin.lastName ?? ""}`.trim() || "Admin"

    void instantiateUser(profile.admin.id, adminName, "", token).then(
      () => {
        if (!cancelled) setStreamReady(true)
      },
      () => {
        if (!cancelled) setStreamReady(false)
      },
    )

    return () => {
      cancelled = true
      setStreamReady(false)
      setChannelExists(null)
    }
  }, [isOpen, request, profile?.admin, streamToken?.userChatToken, instantiateUser])

  useEffect(() => {
    if (!isOpen || !request || !streamReady || !channelId) {
      setChannelExists(null)
      return
    }

    let cancelled = false
    setChannelExists(null)

    void checkIfChannelExists(channelId)
      .then((exists) => {
        if (!cancelled) setChannelExists(exists)
      })
      .catch(() => {
        if (!cancelled) setChannelExists(false)
      })

    return () => {
      cancelled = true
    }
  }, [isOpen, request, streamReady, channelId, checkIfChannelExists, channelRecheckKey])

  if (!request || !target || !isOpen) return null

  const handleCreateChannel = () => {
    if (!otherUserId) {
      onClose()
      return
    }

    createChannel(
      {
        otherUserId: Number(otherUserId),
        customRequestId: Number(request.id),
      },
      {
        onSuccess: () => setChannelRecheckKey((key) => key + 1),
      },
    )
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-[1100] bg-secondary-000/40"
            onClick={onClose}
            aria-label="Close message drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="fixed inset-x-0 bottom-0 z-[1101] flex max-h-[90vh] flex-col rounded-t-2xl bg-white shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:w-[min(100vw,28rem)] md:max-w-md md:rounded-none"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {channelExists === null || !streamReady ? (
              <div className="flex min-h-[320px] flex-1 items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
              </div>
            ) : channelExists ? (
              <AdminMessageDrawerBody
                channelId={channelId}
                title={contactName ?? "Conversation"}
                subtitle={subtitle}
                onClose={onClose}
              />
            ) : (
              <div className="flex min-h-[320px] flex-col">
                <div className="flex items-center justify-between border-b border-border px-4 py-4">
                  <div>
                    <p className="font-unbounded text-base font-semibold text-secondary-000">
                      Message {contactName}
                    </p>
                    <p className="font-unageo text-xs text-accent-70">{subtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-secondary-800"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
                  <p className="font-unbounded text-base font-semibold text-secondary-000">
                    Start a conversation
                  </p>
                  <p className="font-unageo text-sm text-accent-70">
                    No chat exists for this custom request yet. Create the channel to message{" "}
                    {contactName ?? "this party"}.
                  </p>
                  <button
                    type="button"
                    disabled={isCreatingChannel || !otherUserId}
                    onClick={handleCreateChannel}
                    className="rounded-xl bg-primary-100 px-5 py-3 font-unageo text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {isCreatingChannel ? "Creating…" : `Message ${contactName?.split(" ")[0] ?? "user"}`}
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
