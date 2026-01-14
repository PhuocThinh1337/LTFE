import React, { useRef, useEffect } from 'react';

interface ChatSidebarProps {
    comments: any[];
    commentInput: string;
    setCommentInput: (val: string) => void;
    handleSendComment: (e: React.FormEvent) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
    comments,
    commentInput,
    setCommentInput,
    handleSendComment
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when comments change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [comments]);

    return (
        <div className="chat-sidebar">
            <div className="chat-header">
                <h4>💬 Trò chuyện trực tiếp</h4>
            </div>

            <div className="chat-messages">
                {comments.map((msg, idx) => (
                    <div key={idx} className="chat-message">
                        <div className="message-avatar">{msg.userName.charAt(0)}</div>
                        <div className="message-content">
                            <span className="message-user">{msg.userName}</span>
                            <span className="message-text">{msg.text}</span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <form className="chat-form" onSubmit={handleSendComment}>
                    <input
                        type="text"
                        placeholder="Nhập bình luận..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="chat-input"
                    />
                    <button type="submit" className="send-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatSidebar;
