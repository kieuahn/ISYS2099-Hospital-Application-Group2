import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthButtons() {
    return (
        <div className="space-x-2">
            <Link to="/login">
                <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                >
                    Log In
                </button>
            </Link>
            <Link to="/signup">
                <button
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                    Sign Up
                </button>
            </Link>


        </div>
    );
}
