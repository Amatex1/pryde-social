import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Pusher from "pusher-js";
import ChatSearchBar from "./ChatSearchBar";
import "./messengerChats.css";

const MessengerChats = ({
    activeChatId,
    setActiveChatId,
    setActiveUser,
    openCreateGroup,
}) => {
    const [chats, setChats] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const profile = JSON.parse(localStorage.getItem("profile"));
    const userId = profile?.result?._id;
    const token = profile?.token;

    const loadChats = async () => {
        const res = await axios.get(`/chats/my?userId=${userId}`);
        setChats(res.data);
    };

    useEffect(() => {
        loadChats();
    }, []);

    // Presence
    useEffect(() => {
        const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
            cluster: process.env.REACT_APP_PUSHER_CLUSTER,
            authEndpoint: "/pusher/auth",
        });

        const channel = pusher.subscribe("presence-global");

        channel.bind("pusher:subscription_succeeded", (members) => {
            setOnlineUsers(Object.keys(members.members));
        });

        channel.bind("pusher:member_added", (member) => {
            setOnlineUsers((prev) => [...prev, member.id]);
        });

        channel.bind("pusher:member_removed", (member) => {
            setOnlineUsers((prev) => prev.filter((id) => id !== member.id));
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe("presence-global");
        };
    }, []);

    const handleChatSelect = (chat) => {
        setActiveChatId(chat._id);
        const other = chat.members.find((m) => m._id !== userId);
        setActiveUser(other || null);
    };

    return (
        <div className="chatsWrapper">
            <div className="chatsHeader">
                <h2>Messages</h2>
                <button className="createGroupBtn" onClick={openCreateGroup}>
                    + Group
                </button>
            </div>

            <ChatSearchBar setChats={setChats} userId={userId} />

            <div className="chatList">
                {chats.map((chat) => {
                    const isOnline = chat.members.some((m) =>
                        onlineUsers.includes(m._id)
                    );

                    const other = chat.members.find((m) => m._id !== userId);

                    return (
                        <div
                            key={chat._id}
                            className={`chatItem ${activeChatId === chat._id ? "activeChat" : ""
                                }`}
                            onClick={() => handleChatSelect(chat)}
                        >
                            <div className="avatarWrapper">
                                <img
                                    src={
                                        other?.profilePhoto
                                            ? `http://localhost:5000/retrieve/file/${other.profilePhoto}`
                                            : "/default-avatar.png"
                                    }
                                    className="chatAvatar"
                                    alt=""
                                />
                                {isOnline && <div className="onlineDot"></div>}
                            </div>

                            <div className="chatInfo">
                                <h4>{other?.nickname || other?.fullname}</h4>
                                <p className="lastMessage">
                                    {chat.lastMessage?.text || "No messages yet"}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MessengerChats;
