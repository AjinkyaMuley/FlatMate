import React from 'react'
import { Bell, Home,  MessageCircle,  Search, Settings, User } from 'lucide-react';
import Navbar from './navbar';
import Message from './Message';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-primary">RoommateFinder</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Bell className="w-6 h-6 text-gray-500" />
                            <MessageCircle className="w-6 h-6 text-gray-500" />
                            <User className="w-6 h-6 text-gray-500" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-16 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <Navbar icon={<Home />} label="Home" />
                        <Navbar icon={<Search/>} label="Search" />
                        <Navbar icon={<Message />} label="Messages" />
                        <Navbar icon={<Settings />} label="Profile" />
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default MainLayout
