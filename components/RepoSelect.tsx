// Dropdown.js 

'use client'
import { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';

export default function RepoSelect() {
    const [isOpen, setIsOpen] = useState(false);
    const [repo, setRepo] = useState('');

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
      <div className="flex justify-center min-h-screen">
        <div className="relative inline-block text-left border-transparent">
            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute origin-bottom-right absolute right-0 
                                mt-2 w-56 rounded-md
                                shadow-lg bg-white ring-1 ring-black
                                ring-opacity-5 focus:outline-none">
                    <input />
                </div>
            )}
            {/* Dropdown button */}
            <button
                type="button"
                className="inline-flex justify-center w-full text-2xl border-transparent
                            rounded-md border border-gray-300
                            px-4 py-2 "
                onClick={toggleDropdown}
            >+</button>
        </div>
      </div>
    );
}