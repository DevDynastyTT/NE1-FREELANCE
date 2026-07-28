'use client'
import { useEffect, useRef } from 'react'
import MessageForm from '@/components/inbox/[id]/messageForm';
import Image from 'next/image'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { MessagesType, SessionType } from '@/utils/types';

type ChatBoxProps = {
    session?: SessionType;
    receiver?: SessionType;
    setReceivedMessages: React.Dispatch<React.SetStateAction<MessagesType[]>>;
    receivedMessages: MessagesType[];
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    isTyping?: boolean;
};

function formatMsgTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    if (sameDay) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDayLabel(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === now.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
}

function isSameDay(a: string, b: string) {
    return new Date(a).toDateString() === new Date(b).toDateString();
}

export default function ChatBox(props: ChatBoxProps) {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current)
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [props.receivedMessages, props.isTyping]);

    return (
        <main className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-gray-50">
                {props.receivedMessages?.map((msg, index) => {
                    const prevMsg = props.receivedMessages[index - 1];
                    const showDayDivider = !prevMsg || !isSameDay(prevMsg.sentAt, msg.sentAt);

                    return (
                        <div key={index}>
                            {showDayDivider && msg.sentAt && (
                                <div className="flex items-center gap-3 my-4">
                                    <div className="flex-1 h-px bg-gray-200" />
                                    <span className="text-xs text-muted-foreground font-medium px-2">{formatDayLabel(msg.sentAt)}</span>
                                    <div className="flex-1 h-px bg-gray-200" />
                                </div>
                            )}
                            <div className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md ${msg.isSender ? 'items-end' : 'items-start'} flex flex-col`}>
                                    <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${msg.isSender
                                        ? 'bg-primary text-white rounded-br-sm'
                                        : 'bg-white text-gray-900 rounded-bl-sm border border-gray-100'
                                        }`}>
                                        {msg.content}

                                        {msg.file && typeof msg.file !== 'string' && (() => {
                                            const fileObj = msg.file as { name: string; url: string };
                                            const ext = fileObj.name?.split(".").pop()?.toLowerCase() || '';
                                            if (['jpg', 'png', 'jpeg', 'gif', 'webp'].includes(ext)) return (
                                                <div className="mt-2">
                                                    <Image src={fileObj.url} alt={fileObj.name} width={200} height={200} unoptimized className="rounded-lg" />
                                                    <a href={fileObj.url} download={fileObj.name} className="mt-1 flex items-center gap-1 text-xs opacity-70 hover:opacity-100">
                                                        <FontAwesomeIcon icon={faDownload} /> Download
                                                    </a>
                                                </div>
                                            );
                                            if (ext === 'mp4') return <video controls width={200} className="mt-2 rounded-lg"><source src={fileObj.url} type="video/mp4" /></video>;
                                            if (ext === 'mp3') return <audio controls className="mt-2"><source src={fileObj.url} type="audio/mp3" /></audio>;
                                            return <p className="mt-1 text-xs opacity-70">Unsupported file: {ext}</p>;
                                        })()}
                                    </div>
                                    {msg.sentAt && (
                                        <span className="text-[10px] text-muted-foreground mt-0.5 px-1">{formatMsgTime(msg.sentAt)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Typing indicator */}
                {props.isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}

                <div ref={props.messagesEndRef} />
            </div>

            <MessageForm
                setMessage={() => { }}
                setReceivedMessages={props.setReceivedMessages}
                message=""
                session={props.session}
                receiver={props.receiver}
            />
        </main>
    )
}
