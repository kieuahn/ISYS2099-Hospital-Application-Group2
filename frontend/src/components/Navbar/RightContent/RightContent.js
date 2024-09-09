import React from 'react';
import AuthButtons from './AuthButtons';
import UserMenu from './UserMenu';
import AuthContext from '../../../context/AuthContext';
import { useContext } from 'react';

const RightContent = () => {
    const { auth } = useContext(AuthContext);

    return (
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

            {auth ? (
                <>
                    <span className="text-white mr-4">Welcome, {auth.name} {auth.role}!</span>
                    <UserMenu />
                </>
            ) : (

                <>
                    <AuthButtons />
                </>
            )}
        </div>
    );
};

export default RightContent;
