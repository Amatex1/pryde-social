import React, { useState } from "react";
import "./login.css";
import { Button } from "@material-ui/core";
import axios from "../axios.js";
import { useHistory, NavLink } from "react-router-dom";

const Login = () => {
    const history = useHistory();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const signIn = async () => {
        if (!loginData.email || !loginData.password) {
            alert("Please enter your email and password.");
            return;
        }

        try {
            const resp = await axios.post("/login", loginData);
            if (resp.data?.token) {
                localStorage.setItem("profile", JSON.stringify(resp.data));
                history.push("/");
            }
        } catch (err) {
            alert("Invalid login details.");
        }
    };

    return (
        <div className="login">
            <div className="login__card">
                <h1 className="login__logo">Pryde</h1>
                <h3>Login to your account</h3>

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={handleChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleChange}
                />

                <Button
                    style={{ backgroundColor: "var(--pryde-primary)", color: "white" }}
                    fullWidth
                    onClick={signIn}
                >
                    Login
                </Button>

                <NavLink to="/signup" className="login__link">
                    Create a Pryde account
                </NavLink>
            </div>
        </div>
    );
};

export default Login;
