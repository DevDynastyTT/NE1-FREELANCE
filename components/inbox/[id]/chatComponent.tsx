'use client'

import { getUserSession } from "@/utils/reuseableCode"
import { MessagesType, SessionType } from "@/utils/types"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { getReceiver, receiveMessageRoute } from '@/utils/APIRoutes'
import axios from 'axios'
import ChatNavigationComponent from "@/components/inbox/[id]/chatNavigationComponent"
import ChatBox from "@/components/inbox/[id]/chatBox"

export default function ChatComponent() {
    const { id: receiverID } = useParams();

    const router = useRouter();
    const [session, setSession] = useState<SessionType>();
    const [receiver, setReceiver] = useState<SessionType>();
    const [receivedMessages, setReceivedMessages] = useState<MessagesType[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const eventSourceRef = useRef<EventSource | null>(null);

    async function handleOnline(userSession: SessionType) {
      await axios.post('/api/auth/messages/online', { userID: userSession._id }).catch(() => {});
    }

    async function fetchAllMessages() {
      try {
        if (receiverID) {
          const response = await axios.get(
            `${receiveMessageRoute}/${session?._id}/${receiverID}`
          );
    
          const data = response.data;
          if (response.status !== 200) {
            console.error(data.error);
            return;
          }
          const messages = data.messages.map((msg: MessagesType & { senderID: string }) => ({
            content: msg.content,
            file: msg.file,
            sender: msg.sender,
            receiver: msg.receiver,
            isSender: msg.senderID === session?._id,
            sentAt: msg.sentAt
          }));

          setReceivedMessages(messages);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchReceiver() {
      try {
        const response = await axios.get(`${getReceiver}/${receiverID}`);
        const data = response.data;
        if (response.status !== 200) {
          console.error(data.error);
          return;
        }
        setReceiver(data.receiver);
      } catch (error) {
        console.error(error);
      }
    }

    async function authenticateMessages(userSession: SessionType) {
      handleOnline(userSession);
      await fetchReceiver();
      await fetchAllMessages();

      const eventSource = new EventSource(`/api/auth/messages/stream/${userSession._id}`);
      eventSourceRef.current = eventSource;

      const onlineInterval = setInterval(() => {
        handleOnline(userSession);
      }, 30000);

      eventSource.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        const newMsg: MessagesType = {
          content: data.newMessage || data.message || "",
          sender: data.sender || receiver?.username || "",
          receiver: session?.username || "",
          isSender: false,
          sentAt: new Date().toISOString(),
          file: data.file,
        };
        setReceivedMessages((prev) => [...prev, newMsg]);
      });

      eventSource.addEventListener("typing", (event) => {
        const data = JSON.parse(event.data);
        setIsTyping(data.isTyping && data.receiverID === userSession._id);
      });

      eventSource.addEventListener("error", () => {});

      return () => {
        clearInterval(onlineInterval);
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
      };
    }

    useEffect(() => {
      let cleanup: (() => void) | undefined;

      if (session && receiverID) {
        authenticateMessages(session).then((fn) => { cleanup = fn; });
      }

      return () => {
        if (cleanup) cleanup();
      };
    }, [session, receiverID]);

    useEffect(() => {
      const isAuthenticated = getUserSession();

      if (isAuthenticated?._id) {
        setSession(isAuthenticated);
        handleOnline(isAuthenticated);
      } else {
        router.push('/auth/login');
      }

      return () => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
      };
    }, []);

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <ChatNavigationComponent 
              isTyping={isTyping}
              router={router} 
              receiverUsername={receiver?.username}/>
            <ChatBox
              session={session} receiver={receiver}
              setReceivedMessages={setReceivedMessages}
              receivedMessages={receivedMessages} messagesEndRef={messagesEndRef}
              isTyping={isTyping}
            />
        </>
    )
}
