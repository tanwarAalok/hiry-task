import React, { useState } from 'react';

const DropDownMenu = ({contact, onBlock, onArchive}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                id="dropdownMenuIconButton"
                onClick={toggleDropdown}
                className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 rounded-lg hover:bg-gray-100"
                type="button"
            >
                <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 4 15"
                >
                    <path
                        d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                    />
                </svg>
            </button>

            <div
                id="dropdownDots"
                className={`z-10 ${isOpen ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute right-0 mt-2`}
            >
                <ul
                    className="py-2 text-sm text-gray-700"
                    aria-labelledby="dropdownMenuIconButton"
                >
                    <li>
                        <button
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => {
                                onBlock(contact.id, !contact.blocked)
                                setIsOpen(false)
                            }}
                        >
                            {
                                contact.blocked ? 'Unblock User' : 'Block User'
                            }
                        </button>
                    </li>
                    <li>
                        <button
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => {
                                onArchive(contact.id, !contact.archived)
                                setIsOpen(false)
                            }}
                        >
                            {
                                contact.archived ? 'Unarchive User' : 'Archive User'
                            }
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DropDownMenu;
