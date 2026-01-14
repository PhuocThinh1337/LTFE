import { useState, useRef, useEffect } from 'react';
import { checkToxicContent } from '../services/moderation';
import { sendComment, subscribeToComments } from '../services/firebase';

interface UseLiveChatProps {
    role: 'host' | 'audience' | null;
    user: any;
}

export const useLiveChat = ({ role, user }: UseLiveChatProps) => {
    const [comments, setComments] = useState<any[]>([]);
    const [commentInput, setCommentInput] = useState("");
    const lastChatTime = useRef<number>(0);

    useEffect(() => {
        // Clear old chat locally on mount/remount effectively handled by logic in page or here?
        // In the original file, it clears localStorage on mount.
        localStorage.removeItem('live_comments');

        const unsubscribeComments = subscribeToComments((newComments) => {
            setComments(newComments);
        });

        return () => {
            unsubscribeComments();
        };
    }, []);

    const handleSendComment = async (e: React.FormEvent) => {
        e.preventDefault();
        const content = commentInput.trim();
        if (!content) return;

        // --- BƯỚC 1: CHẶN SPAM (RATE LIMIT) ---
        const now = Date.now();
        if (now - lastChatTime.current < 2000) {
            alert("⏳ Bạn chat quá nhanh! Vui lòng đợi 2 giây.");
            return;
        }
        lastChatTime.current = now;

        let userName = 'Khách';
        if (role === 'host') {
            userName = 'Host';
        } else if (user && user.name) {
            userName = user.name;
        }

        // --- UI FEEDBACK ---
        const btn = document.querySelector('.send-btn') as HTMLButtonElement;
        const originalContent = btn ? btn.innerHTML : '';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span style="font-size: 20px">...</span>';
        }

        // --- BƯỚC 2: CHECK TOXIC (AI) ---
        const isToxic = await checkToxicContent(content);

        // Restore button
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalContent;
        }

        if (isToxic) {
            alert("⚠️ Tin nhắn bị chặn vì vi phạm tiêu chuẩn cộng đồng!");
            return;
        }

        // --- BƯỚC 3: GỬI LÊN FIREBASE ---
        sendComment(userName, content);
        setCommentInput("");
    };

    return {
        comments,
        commentInput,
        setCommentInput,
        handleSendComment
    };
};
