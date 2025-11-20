import React, { useEffect, useState } from "react";
import axios from "../../axios";
import GroupMembersList from "./GroupMembersList";
import "./messengerChatDetails.css";

const MessengerChatDetails = ({ activeChatId, activeUser, openCreateGroup }) => {
    const [chat, setChat] = useState(null);

    const loadChat = async () => {
        if (!activeChatId) return;
        const res = await axios.get(`/chats/my?chatId=${activeChatId}`);
        setChat(res.data);
    };

    useEffect(() => {
        loadChat();
    }, [activeChatId]);

    if (!activeChatId)
        return <div className="detailsEmpty">Select a chat</div>;

    if (!chat)
        return <div className="detailsLoading">Loading…</div>;

    const isGroup = chat.isGroup;

    return (
        <div className="detailsWrapper">
            {!isGroup && (
                <>
                    <img
                        className="detailsAvatar"
                        src={
                            activeUser?.profilePhoto
                                ? `http://localhost:5000/retrieve/file/${activeUser.profilePhoto}`
                                : "/default-avatar.png"
                        }
                        alt=""
                    />

                    <h3>{activeUser?.nickname || activeUser?.fullname}</h3>

                    <p className="detailsBio">{activeUser?.bio}</p>
                </>
            )}

            {isGroup && (
                <>
                    <img
                        className="detailsAvatar"
                        src={
                            chat.icon
                                ? `http://localhost:5000/retrieve/file/${chat.icon}`
                                : "/group-default.png"
                        }
                        alt=""
                    />

                    <h3>{chat.name}</h3>

                    <GroupMembersList chat={chat} />
                </>
            )}

            <button className="newGroupBtn" onClick={openCreateGroup}>
                New Group
            </button>
        </div>
    );
};

export default MessengerChatDetails;
