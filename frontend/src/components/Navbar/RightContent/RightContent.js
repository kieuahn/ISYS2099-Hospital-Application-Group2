import React from 'react';
import AuthButtons from './AuthButtons';
import Icons from './Icons';
import UserMenu from './UserMenu';

export default function RightContent() {
    return (
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Icons />
            <AuthButtons />
            <UserMenu />
        </div>
    );
}
