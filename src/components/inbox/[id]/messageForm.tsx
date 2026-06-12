'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { sendMessageRoute } from '@/utils/APIRoutes';
import axios from 'axios';
import { FormEvent, useRef, useState } from 'react';
import { MessagesType, SessionType } from '@/utils/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type MessageFormProps = {
    message: string;
    setMessage: (value: string) => void;
    setReceivedMessages: React.Dispatch<React.SetStateAction<MessagesType[]>>;
    session?: SessionType;
    receiver?: SessionType;
};

export default function MessageForm(props: MessageFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [text, setText] = useState('');

    async function sendMessage(event: FormEvent) {
        event.preventDefault();
        if (!text.trim() && !fileInputRef.current?.files?.[0]) return;

        const formData = new FormData();
        if (fileInputRef.current?.files?.[0]) formData.append('file', fileInputRef.current.files[0]);
        formData.append('content', text);
        formData.append('sender', props.session?.username || '');
        formData.append('receiver', props.receiver?.username || '');
        formData.append('senderID', props.session?._id || '');
        formData.append('receiverID', props.receiver?._id || '');

        try {
            await axios.post(sendMessageRoute, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            props.setReceivedMessages(prev => [...prev, {
                content: text,
                sender: props.session?.username || '',
                receiver: props.receiver?.username || '',
                isSender: true,
                sentAt: new Date().toISOString(),
            }]);
        } catch (error) {
            console.error('[MessageForm] Error:', error);
        } finally {
            setText('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }

    function sendTypingAlert() {
        if (props.session?._id && props.receiver?._id) {
            axios.post('/api/auth/messages/typing', { senderID: props.session._id, receiverID: props.receiver._id }).catch(() => { });
        }
    }

    return (
        <form
            className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3"
            onSubmit={sendMessage}
            encType="multipart/form-data"
        >
            <label htmlFor="document" className="cursor-pointer text-gray-400 hover:text-primary transition-colors p-2">
                <FontAwesomeIcon icon={faPaperclip} className="w-4 h-4" />
            </label>
            <input type="file" name="document" id="document" ref={fileInputRef} className="hidden" />

            <Input
                className="flex-1 bg-gray-50 border-gray-200"
                type="text"
                value={text}
                placeholder="Type a message..."
                onChange={(event) => { setText(event.target.value); sendTypingAlert(); }}
            />

            <Button type="submit" size="icon" className="flex-shrink-0 rounded-full">
                <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
            </Button>
        </form>
    )
}
