'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faCircle } from "@fortawesome/free-solid-svg-icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ChatNavigationComponent(props: {
    isTyping: boolean;
    router: { back: () => void };
    receiverUsername?: string;
}) {
    return (
        <nav className="sticky top-0 z-40 bg-gray-900 border-b border-white/10 h-16 flex items-center px-4 gap-4">
            <button
                onClick={() => props.router.back()}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                aria-label="Go back"
            >
                <FontAwesomeIcon icon={faArrowLeftLong} className="w-4 h-4" />
            </button>

            <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-primary text-white text-sm">
                    {props.receiverUsername?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div>
                <p className="text-white font-semibold text-sm leading-none">{props.receiverUsername}</p>
                {props.isTyping && (
                    <p className="text-xs text-green-400 mt-0.5 flex items-center gap-1">
                        <FontAwesomeIcon icon={faCircle} className="text-[8px]" />
                        typing...
                    </p>
                )}
            </div>
        </nav>
    )
}
