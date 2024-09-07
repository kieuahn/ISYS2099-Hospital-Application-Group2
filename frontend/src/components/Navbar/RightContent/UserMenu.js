import React, { useContext } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import AuthContext from '../../../context/AuthContext';

export default function UserMenu() {
    const { auth, logout } = useContext(AuthContext);

    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open user menu</span>
                    <img
                        alt="Profile"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="h-8 w-8 rounded-full"
                    />
                </MenuButton>
            </div>
            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <MenuItem>
                    <a href="/#" className="block px-4 py-2 text-sm text-gray-700">
                        Your Profile
                    </a>
                </MenuItem>
                <MenuItem>
                    <a href="/settings" className="block px-4 py-2 text-sm text-gray-700">
                        Settings
                    </a>
                </MenuItem>
                {auth && auth.role === "admin" && (
                    <MenuItem>
                        <a href="/admin" className="block px-4 py-2 text-sm text-gray-700">
                            Admin Dashboard
                        </a>
                    </MenuItem>
                )}
                <MenuItem>
                    <button
                        onClick={logout}
                        className="block px-4 py-2 text-sm text-gray-700 w-full text-left"
                    >
                        Sign out
                    </button>
                </MenuItem>
            </MenuItems>
        </Menu>
    );
}
