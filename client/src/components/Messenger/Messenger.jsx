import React, { useState } from "react";
import "./messenger.css";

import MessengerChats from "./MessengerChats";
import MessengerBody from "./MessengerBody";
import MessengerChatDetails from "./MessengerChatDetails";
import GroupCreateModal from "./GroupCreateModal";
import api from "../../axios";

const Messenger = () => {
    const [activeChatId, setActiveChatId] = useState(null);
    const [activeUser, setActiveUser] = useState(null);
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    return (
        <div className="messengerWrapper">

            {/* LEFT SIDEBAR */}
            <div className="messengerLeft">
                <MessengerChats
                    activeChatId={activeChatId}
                    setActiveChatId={setActiveChatId}
                    setActiveUser={setActiveUser}
                    openCreateGroup={() => setShowCreateGroup(true)}
                />
            </div>

            {/* MIDDLE PANEL */}
            <div className="messengerMiddle">
                <MessengerBody
                    activeChatId={activeChatId}
                    activeUser={activeUser}
                />
            </div>

            {/* RIGHT PANEL */}
            <div className="messengerRight">
                <MessengerChatDetails
                    activeChatId={activeChatId}
                    activeUser={activeUser}
                    openCreateGroup={() => setShowCreateGroup(true)}
                />
            </div>

            {/* GROUP CREATION MODAL */}
            {showCreateGroup && (
                <GroupCreateModal onClose={() => setShowCreateGroup(false)} />
            )}
        </div>
    );
};

export default Messenger;
