'use client'

import GlobalNavbar from "@/components/GlobalNavbar";
import { getRecentChats, searchUsers } from "@/utils/APIRoutes";
import { getUserSession } from "@/utils/reuseableCode";
import { RecentChatsType, SessionType } from "@/utils/types";
import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function formatChatTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function InboxComponent() {
    const router = useRouter();
    const [session, setSession] = useState<SessionType>();
    const [users, setUsers] = useState<SessionType[]>([]);
    const [recentChats, setRecentChats] = useState<RecentChatsType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const eventSourceRef = useRef<EventSource | null>(null);

    async function handleOnline(userSession: SessionType) {
        await axios.post('/api/auth/messages/online', { userID: userSession._id }).catch(() => { });
    }

    async function fetchRecentChats(userID: string) {
        try {
            const response = await axios.get(`${getRecentChats}/${userID}`);
            const data = response.data;
            const chatsWithTimestamp = await Promise.all(
                (data.recentChats ?? []).map(async (chat: RecentChatsType) => {
                    try {
                        const chatResponse = await axios.get(`${getRecentChats}/${chat.userID}`);
                        const mostRecentMessage = chatResponse.data.receivedMessages[0];
                        return { ...chat, sentAt: mostRecentMessage?.sentAt };
                    } catch { return chat; }
                })
            );
            setRecentChats(chatsWithTimestamp);
        } catch (error) {
            console.error(error, "Failed to fetch recent chats");
        }
    }

    useEffect(() => {
        const isAuthenticated = getUserSession();
        if (isAuthenticated?._id) {
            setSession(isAuthenticated);
            handleOnline(isAuthenticated);
            const onlineInterval = setInterval(() => handleOnline(isAuthenticated), 30000);
            fetchRecentChats(isAuthenticated._id);
            const eventSource = new EventSource(`/api/auth/messages/stream/${isAuthenticated._id}`);
            eventSourceRef.current = eventSource;
            eventSource.addEventListener("message", async () => { await fetchRecentChats(isAuthenticated._id); });
            eventSource.addEventListener("error", () => { });
            setIsLoading(false);
            return () => {
                clearInterval(onlineInterval);
                eventSource.close();
                eventSourceRef.current = null;
            };
        }
        setIsLoading(false);
    }, []);

    async function handleSearchUsers(event: FormEvent<HTMLInputElement>) {
        try {
            const response = await axios.get(`${searchUsers}/${event.currentTarget.value}`);
            setUsers(response.data.userInfo);
        } catch (error) {
            console.error(error);
        }
    }

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <>
            {session?._id && (
                <>
                    <GlobalNavbar session={session} />

                    <main className="min-h-screen bg-gray-50">
                        <div className="max-w-2xl mx-auto px-4 py-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

                            {/* Search */}
                            <div className="relative mb-6">
                                <Input
                                    type="text"
                                    placeholder="Search for users..."
                                    onChange={handleSearchUsers}
                                    className="bg-white"
                                />
                                {users?.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                                        {users.map((currentUser, index) =>
                                            currentUser._id !== session._id ? (
                                                <button
                                                    key={index}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                                    onClick={() => router.push(`/inbox/${currentUser._id}`)}
                                                >
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarFallback className="text-xs">{currentUser.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm font-medium text-gray-900">{currentUser.username}</span>
                                                    {currentUser.isActive && (
                                                        <FontAwesomeIcon className="text-green-500 text-xs ml-auto" icon={faCircle} />
                                                    )}
                                                </button>
                                            ) : null
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Recent chats */}
                            {recentChats.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Recent Chats</p>
                                    {recentChats.map((chat, index) =>
                                        chat.username !== session.username ? (
                                            <button
                                                key={index}
                                                className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all text-left"
                                                onClick={() => router.push(`/inbox/${chat?.userID}`)}
                                            >
                                                <Avatar className="w-10 h-10 flex-shrink-0">
                                                    <AvatarFallback>{chat.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="font-medium text-gray-900 text-sm">{chat.username}</p>
                                                        {chat.sentAt && (
                                                            <span className="text-xs text-muted-foreground flex-shrink-0">{formatChatTime(chat.sentAt)}</span>
                                                        )}
                                                    </div>
                                                    {chat.newMessage && (
                                                        <p className="text-xs text-muted-foreground truncate mt-0.5">{chat.newMessage}</p>
                                                    )}
                                                </div>
                                                {chat.newMessage && <Badge variant="secondary" className="flex-shrink-0 text-xs ml-1">New</Badge>}
                                            </button>
                                        ) : null
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-20 space-y-3">
                                    <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="font-medium text-gray-900 text-sm">No conversations yet</p>
                                    <p className="text-muted-foreground text-xs">Search for a user above to start chatting.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </>
            )}
        </>
    );
}
