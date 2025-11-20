import React, { useEffect, useState } from "react";
import axios from "../../axios";
import "./profile.css";
import EditProfileModal from "./EditProfileModal";
import Post from "../Feed/Post";
import FriendButton from "./FriendButton";

const Profile = () => {
    const [user, setUser] = useState(null); // Profile being viewed
    const [viewer, setViewer] = useState(null); // Logged-in user
    const [posts, setPosts] = useState([]);
    const [editOpen, setEditOpen] = useState(false);

    const refreshProfile = () => {
        loadProfile();
        loadViewer();
    };

    const backend = process.env.REACT_APP_BACKEND_URL;

    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get("id");

    const loadViewer = async () => {
        try {
            const res = await axios.get("/user/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setViewer(res.data);
        } catch (err) {
            console.error("Load viewer error:", err);
        }
    };

    const loadProfile = async () => {
        try {
            const res = await axios.get(`/users/${profileId}`);
            setUser(res.data);
        } catch (err) {
            console.error("Load profile error:", err);
        }
    };

    const loadPosts = async () => {
        try {
            const res = await axios.get(`/posts/user/${profileId}`);
            setPosts(res.data);
        } catch (err) {
            console.error("Load posts error:", err);
        }
    };

    useEffect(() => {
        loadViewer();
        loadProfile();
        loadPosts();
    }, [profileId]);

    const uploadProfilePhoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const form = new FormData();
        form.append("image", file);

        try {
            await axios.post("/upload/profile", form, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            loadProfile();
            loadViewer();
        } catch (err) {
            console.error("Profile photo upload error:", err);
        }
    };

    const uploadCoverPhoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const form = new FormData();
        form.append("image", file);

        try {
            await axios.post("/upload/cover", form, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            loadProfile();
            loadViewer();
        } catch (err) {
            console.error("Cover upload error:", err);
        }
    };

    if (!user || !viewer) return <div className="profileLoading">Loading…</div>;

    const isOwner = viewer._id === user._id;

    return (
        <div className="profilePage">
            {/* ---- COVER PHOTO ---- */}
            <div className="profileCoverWrapper">
                <img
                    className="profileCover"
                    src={
                        user.coverPhoto
                            ? `${backend}retrieve/file/${user.coverPhoto}`
                            : "/default-cover.png"
                    }
                    alt=""
                />

                {isOwner && (
                    <>
                        <label htmlFor="coverUpload" className="editCoverBtn">
                            Change Cover
                        </label>
                        <input
                            type="file"
                            id="coverUpload"
                            hidden
                            onChange={uploadCoverPhoto}
                        />
                    </>
                )}
            </div>

            {/* ---- PROFILE INFO CARD ---- */}
            <div className="profileInfoCard">
                <div className="profileAvatarWrapper">
                    <img
                        className="profileAvatar"
                        src={
                            user.profilePhoto
                                ? `${backend}retrieve/file/${user.profilePhoto}`
                                : "/default-avatar.png"
                        }
                        alt=""
                    />

                    {isOwner && (
                        <>
                            <label htmlFor="avatarUpload" className="editAvatarBtn">
                                📷
                            </label>
                            <input
                                type="file"
                                id="avatarUpload"
                                hidden
                                onChange={uploadProfilePhoto}
                            />
                        </>
                    )}
                </div>

                <h2 className="profileName">
                    {user.nickname || user.fullname}
                </h2>

                {user.pronouns && (
                    <p className="profilePronouns">{user.pronouns}</p>
                )}

                <FriendButton
                    viewer={viewer}
                    user={user}
                    refreshProfile={refreshProfile}
                />

                {user.bio && <p className="profileBio">{user.bio}</p>}

                {isOwner && (
                    <button
                        className="editProfileButton"
                        onClick={() => setEditOpen(true)}
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {/* ---- FRIENDS ---- */}
            <div className="profileFriendsWrapper">
                <h3 className="profileFriendsTitle">Friends</h3>

                {user.friends?.length === 0 && (
                    <p className="noFriendsMessage">No friends yet.</p>
                )}

                <div className="friendsGrid">
                    {user.friends?.map((friend) => (
                        <div className="friendCard" key={friend._id}>
                            <img
                                src={
                                    friend.profilePhoto
                                        ? `${backend}retrieve/file/${friend.profilePhoto}`
                                        : "/default-avatar.png"
                                }
                                alt=""
                            />
                            <p>{friend.nickname || friend.fullname}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ---- POSTS ---- */}
            <div className="profilePostsWrapper">
                <h3 className="profilePostsTitle">Posts</h3>

                {posts.length === 0 && (
                    <p className="noPostsMessage">No posts yet.</p>
                )}

                {posts.map((p) => (
                    <Post key={p._id} post={p} />
                ))}
            </div>

            {/* ---- EDIT PROFILE MODAL ---- */}
            {editOpen && (
                <EditProfileModal
                    viewer={viewer}
                    onClose={() => setEditOpen(false)}
                    refresh={() => {
                        loadProfile();
                        loadViewer();
                    }}
                />
            )}
        </div>
    );
};

export default Profile;
