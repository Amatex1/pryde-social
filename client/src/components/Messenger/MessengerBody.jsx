import React, { useState, useEffect, useRef } from "react";
import api from "../../axios";
import Pusher from "pusher-js";
import Messages from "./Messages";
import ReactionPicker from "./ReactionPicker";
import "./messengerBody.css";

const MessengerBody = ({ activeChatId, activeUser }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [typingUser, setTypingUser] = useState(null);
    const fileInputRef = useRef(null);
    const bottomRef = useRef(null);

    const profile = JSON.parse(localStorage.getItem("profile"));
    const user = profile?.result;

    const loadMessages = async () => {
        if (!activeChatId) return;
        const res = await axios.get(`/message/${activeChatId}`);
        setMessages(res.data);

        await axios.post("/message/markSeen", {
            chatId: activeChatId,
            userId: user._id,
        });
    };

    useEffect(() => {
        loadMessages();
    }, [activeChatId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!activeChatId) return;

        const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
            cluster: process.env.REACT_APP_PUSHER_CLUSTER,
            authEndpoint: "/pusher/auth",
            auth: {},
        });

        const channel = pusher.subscribe(`presence-chat-${activeChatId}`);
        window.pusherChannel = channel;

        channel.bind("new-message", (data) => {
            setMessages((prev) => [...prev, data.message]);
        });

        channel.bind("typing", (data) => {
            if (data.userId !== user._id) {
                setTypingUser(true);
                setTimeout(() => setTypingUser(null), 2000);
            }
        });

        return () => {
            pusher.unsubscribe(`presence-chat-${activeChatId}`);
        };
    }, [activeChatId]);

    const sendMessage = async () => {
        if (!text.trim()) return;

        await axios.post("/message", {
            sender: user._id,
            chatId: activeChatId,
            text,
        });

        setText("");
    };

    const triggerTyping = () => {
        if (window.pusherChannel) {
            window.pusherChannel.trigger("client-typing", { userId: user._id });
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const form = new FormData();
        form.append("file", file);

        const upload = await axios.post("/upload/chat", form);
        const filename = upload.data.filename;

        await axios.post("/message", {
            sender: user._id,
            chatId: activeChatId,
            file: filename,
        });
    };

    if (!activeChatId)
        return (
            <div className="emptyChat">
                <p>Select a conversation</p>
            </div>
        );

    return (
        <div className="bodyWrapper">
            {/* Header */}
            <div className="chatHeader">
                <img
                    className="chatHeaderAvatar"
                    src={
                        activeUser?.profilePhoto
                            ? `http://localhost:5000/retrieve/file/${activeUser.profilePhoto}`
                            : "/default-avatar.png"
                    }
                    alt=""
                />
                <h3>{activeUser?.nickname || activeUser?.fullname}</h3>
            </div>

            {/* Messages */}
            <div className="messagesSection">
                {messages.map((m) => (
                    <Messages key={m._id} msg={m} currentUserId={user._id} />
                ))}
                <div ref={bottomRef}></div>
            </div>

            {typingUser && (
                <div className="typingIndicator">
                    {activeUser?.nickname || activeUser?.fullname} is typing…
                </div>
            )}

            {/* Input */}
            <div className="inputBar">
                <button
                    className="attachBtn"
                    onClick={() => fileInputRef.current.click()}
                >
                    📎
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    onChange={handleFileUpload}
                />

                <input
                    type="text"
                    className="chatInput"
                    placeholder="Type a message…"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        triggerTyping();
                    }}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />

                <button className="sendBtn" onClick={sendMessage}>
                    ➤
                </button>
            </div>
        </div>
    );
};

export default MessengerBody;
