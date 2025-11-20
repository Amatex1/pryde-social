import React, { useEffect, useState } from "react";
import axios from "../../axios";
import "./friendButton.css";
import FriendButton from "./Profile/FriendButton";

const FriendButton = ({ viewer, user, refreshProfile }) => {
    const [status, setStatus] = useState("loading");

    const backend = process.env.REACT_APP_BACKEND_URL;

    const viewerId = viewer?._id;
    const userId = user?._id;

    /* -----------------------------------------
       Determine current relationship state
    ----------------------------------------- */
    const evaluateStatus = () => {
        if (!viewer || !user) return "loading";

        // Cannot friend yourself
        if (viewerId === userId) return "self";

        // Already friends
        if (viewer.friends?.includes(userId)) return "friends";

        // If viewer sent request → pending
        if (viewer.sentRequests?.includes(userId)) return "sent";

        // If viewer received request → accept/decline
        if (viewer.receivedRequests?.includes(userId)) return "received";

        return "none";
    };

    useEffect(() => {
        setStatus(evaluateStatus());
    }, [viewer, user]);


    /* -----------------------------------------
       ACTION HANDLERS
    ----------------------------------------- */

    const authHeader = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };

    const sendRequest = async () => {
        try {
            await axios.post("/friends/request", { targetId: userId }, authHeader);
            refreshProfile();
        } catch (err) {
            console.error("Friend request error:", err);
        }
    };

    const cancelRequest = async () => {
        try {
            await axios.post("/friends/cancel", { targetId: userId }, authHeader);
            refreshProfile();
        } catch (err) {
            console.error("Cancel request error:", err);
        }
    };

    const acceptRequest = async () => {
        try {
            await axios.post("/friends/accept", { targetId: userId }, authHeader);
            refreshProfile();
        } catch (err) {
            console.error("Accept request error:", err);
        }
    };

    const declineRequest = async () => {
        try {
            await axios.post("/friends/decline", { targetId: userId }, authHeader);
            refreshProfile();
        } catch (err) {
            console.error("Decline request error:", err);
        }
    };

    const removeFriend = async () => {
        try {
            await axios.post("/friends/remove", { targetId: userId }, authHeader);
            refreshProfile();
        } catch (err) {
            console.error("Remove friend error:", err);
        }
    };


    /* -----------------------------------------
       BUTTON RENDERING
    ----------------------------------------- */

    if (status === "loading") return null;
    if (status === "self") return null;

    return (
        <div className="friendButtonContainer">
            {status === "none" && (
                <button className="friendBtn add" onClick={sendRequest}>
                    Add Friend
                </button>
            )}

            {status === "sent" && (
                <button className="friendBtn pending" onClick={cancelRequest}>
                    Cancel Request
                </button>
            )}

            {status === "received" && (
                <div className="friendRequestsRow">
                    <button className="friendBtn accept" onClick={acceptRequest}>
                        Accept
                    </button>
                    <button className="friendBtn decline" onClick={declineRequest}>
                        Decline
                    </button>
                </div>
            )}

            {status === "friends" && (
                <button className="friendBtn friends" onClick={removeFriend}>
                    ✓ Friends
                </button>
            )}
        </div>
    );
};

export default FriendButton;
