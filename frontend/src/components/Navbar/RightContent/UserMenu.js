import React, { useState, useContext } from 'react';
import { Menu, MenuItem, Avatar, IconButton } from '@mui/material';
import AuthContext from '../../../context/AuthContext';

export default function UserMenu() {
    const { auth, logout } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar alt={auth?.name || "Profile"} src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose} component="a" href="/patient/profile">
                    Your Profile
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component="a" href="/settings">
                    Settings
                </MenuItem>
                {auth && auth.role === "admin" && (
                    <MenuItem onClick={handleMenuClose} component="a" href="/admin">
                        Admin Dashboard
                    </MenuItem>
                )}
                <MenuItem onClick={() => {
                    handleMenuClose();
                    logout();
                }}>
                    Sign out
                </MenuItem>
            </Menu>
        </div>
    );
}
