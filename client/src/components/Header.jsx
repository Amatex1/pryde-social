import React from "react";
import "./header.css";
import { Avatar } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import MessageIcon from "@material-ui/icons/Message";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { NavLink } from "react-router-dom";

const Header = () => {
    const user = JSON.parse(localStorage.getItem("profile"))?.result;

    return (
        <div className="header">
            <div className="header__left">
                <div className="header__logo">Pryde</div>
            </div>

            <div className="header__center">
                <NavLink exact to="/" activeClassName="active">
                    <HomeIcon />
                </NavLink>
                <NavLink exact to="/friends" activeClassName="active">
                    <PeopleIcon />
                </NavLink>
                <NavLink exact to="/messenger" activeClassName="active">
                    <MessageIcon />
                </NavLink>
                <NavLink exact to="/notifications" activeClassName="active">
                    <NotificationsIcon />
                </NavLink>
            </div>

            <div className="header__right">
                <div className="header__search">
                    <SearchIcon />
                    <input placeholder="Search Pryde" />
                </div>

                <Avatar src={user?.imageUrl} />
                <span className="header__username">{user?.name}</span>
            </div>
        </div>
    );
};

export default Header;
