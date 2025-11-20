import React, { useState, useEffect } from "react";
import "./editProfile.css";
import axios from "../axios";
import { Avatar } from "@material-ui/core";

const EditProfile = () => {
    const [user, setUser] = useState(null);
    const tokenData = JSON.parse(localStorage.getItem("profile"));
    const token = tokenData?.token;

    // Form fields
    const [nickname, setNickname] = useState("");
    const [pronouns, setPronouns] = useState("");
    const [gender, setGender] = useState("");
    const [relationship, setRelationship] = useState("");
    const [bio, setBio] = useState("");
    const [socialLinks, setSocialLinks] = useState([]);

    // Upload previews
    const [profilePreview, setProfilePreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const fetchData = async () => {
        try {
            const resp = await axios.get("/user/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(resp.data);

            // Prefill
            setNickname(resp.data.nickname || "");
            setPronouns(resp.data.pronouns || "");
            setGender(resp.data.gender || "");
            setRelationship(resp.data.relationship || "");
            setBio(resp.data.bio || "");
            setSocialLinks(resp.data.socialLinks || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Upload helper
    const uploadImage = async (file, type) => {
        const form = new FormData();
        form.append("file", file);

        const endpoint =
            type === "profile" ? "/upload/profilePhoto" : "/upload/coverPhoto";

        const resp = await axios.post(endpoint, form, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        return resp.data.filename;
    };

    const saveProfile = async () => {
        try {
            await axios.post(
                "/updateProfile",
                {
                    nickname,
                    pronouns,
                    gender,
                    relationship,
                    bio,
                    socialLinks,
                    profilePhoto: user.profilePhoto,
                    coverPhoto: user.coverPhoto,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Profile updated!");
        } catch (err) {
            console.log(err);
        }
    };

    const handleProfilePic = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setProfilePreview(URL.createObjectURL(file));

        const filename = await uploadImage(file, "profile");
        setUser({ ...user, profilePhoto: filename });
    };

    const handleCoverPic = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setCoverPreview(URL.createObjectURL(file));

        const filename = await uploadImage(file, "cover");
        setUser({ ...user, coverPhoto: filename });
    };

    if (!user) return <div className="profileLoading">Loading…</div>;

    return (
        <div className="editProfilePage">

            {/* COVER UPLOADER */}
            <div
                className="editCoverPhoto"
                style={{
                    backgroundImage: coverPreview
                        ? `url(${coverPreview})`
                        : user.coverPhoto
                            ? `url(http://localhost:5000/retrieve/image/?name=${user.coverPhoto})`
                            : `linear-gradient(45deg, #6f42c1, #9b6fe3)`
                }}
            >
                <label className="editCoverBtn">
                    Change Cover
                    <input type="file" hidden onChange={handleCoverPic} />
                </label>

                {/* PROFILE UPLOADER */}
                <div className="editProfileAvatar">
                    <Avatar
                        src={
                            profilePreview
                                ? profilePreview
                                : user.profilePhoto
                                    ? `http://localhost:5000/retrieve/image/?name=${user.profilePhoto}`
                                    : null
                        }
                        style={{ width: 140, height: 140 }}
                    />
                    <label className="editProfilePicBtn">
                        Change
                        <input type="file" hidden onChange={handleProfilePic} />
                    </label>
                </div>
            </div>

            {/* FORM */}
            <div className="editForm">

                <label>Nickname</label>
                <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />

                <label>Pronouns</label>
                <input
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                />

                <label>Gender</label>
                <input value={gender} onChange={(e) => setGender(e.target.value)} />

                <label>Relationship</label>
                <input
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                />

                <label>Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

                <button className="saveBtn" onClick={saveProfile}>
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default EditProfile;
