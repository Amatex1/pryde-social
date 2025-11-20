import React, { useState } from "react";
import "./signup.css";
import { Button } from "@material-ui/core";
import { NavLink, useHistory } from "react-router-dom";
import axios from "../axios.js";

const SignUp = () => {
    const history = useHistory();

    const [userData, setUserData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const signUp = async (e) => {
        e.preventDefault();

        if (!userData.email || !userData.password || !userData.firstname || !userData.lastname) {
            alert("All fields are required.");
            return;
        }

        try {
            const response = await axios.post("/signup", userData);

            if (response.data.message === "UserExist") {
                alert("User already exists.");
                return;
            }

            if (response.data.message === "Type Correct Email") {
                alert("Invalid email format.");
                return;
            }

            alert("Account created successfully!");
            history.push("/");

        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div className="signup">
            <div className="signup__card">
                <h1 className="signup__logo">Pryde</h1>
                <h3>Create your account</h3>

                <div className="signup__names">
                    <input
                        name="firstname"
                        value={userData.firstname}
                        onChange={handleChange}
                        placeholder="First Name"
                    />
                    <input
                        name="lastname"
                        value={userData.lastname}
                        onChange={handleChange}
                        placeholder="Last Name"
                    />
                </div>

                <input
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                />

                <input
                    name="password"
                    type="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="Password"
                />

                <Button
                    style={{ backgroundColor: "var(--pryde-primary)", color: "white", marginTop: "20px" }}
                    fullWidth
                    onClick={signUp}
                >
                    Sign Up
                </Button>

                <NavLink className="signup__link" to="/">
                    Already have an account? Login
                </NavLink>
            </div>
        </div>
    );
};

export default SignUp;
