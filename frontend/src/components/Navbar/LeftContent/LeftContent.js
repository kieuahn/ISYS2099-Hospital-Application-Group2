import React from 'react';
import { classNames } from '../../../utils/classNames'; // Ensure you create the utility file
import { Link } from 'react-router-dom';


const LeftContent = ({ auth }) => {
    const role = auth?.role || "";

const navigation = {
        Admin: [
            { name: 'Dashboard', href: '/dashboard', current: true },
            { name: 'Manage Users', href: 'admin/staff-list', current: false },
        ],
        Doctor: [
            { name: 'Dashboard', href: '/doctor/dashboard', current: true },
            { name: 'Patient Records', href: '/doctor/patients', current: false },
            { name: 'Appointments', href: '/doctor/appointments', current: false }
        ],
        Manager: [
            { name: 'Dashboard', href: '/dashboard', current: true },
            { name: 'Staff Management', href: '/manager/staff-list', current: false },
        ],
        Patient: [
            { name: 'Dashboard', href: '/patient/dashboard', current: true },
            { name: 'Appointments', href: '/patient/appointments', current: false },
            { name: 'Medical Records', href: '/patient/records', current: false }
        ]
    }

    const currentNav = navigation[role] || [];

    return (
        <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
                {currentNav.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href}
                        aria-current={item.current ? 'page' : undefined}
                        className={classNames(
                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default LeftContent;
