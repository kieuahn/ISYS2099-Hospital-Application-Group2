import React from 'react';
import { classNames } from '../../../utils/classNames'; // Ensure you create the utility file

const navigation = [
    { name: 'Dashboard', href: '#', current: true },
    { name: 'Team', href: '#', current: false },
    { name: 'Projects', href: '#', current: false },
    { name: 'Calendar', href: '#', current: false },
];

export default function LeftContent() {
    return (
        <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
                {navigation.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        aria-current={item.current ? 'page' : undefined}
                        className={classNames(
                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                    >
                        {item.name}
                    </a>
                ))}
            </div>
        </div>
    );
}
