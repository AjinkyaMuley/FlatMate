import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Send, ImagePlus } from "lucide-react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8000");

const Message = () => {
    const currentUserId = localStorage.getItem('userId');
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const getOtherPersonName = (message, currentUserId) => {
        if (message.sender.id == currentUserId) {
            return message.receiver.name;
        }
        return message.sender.name;
    };

    const formatMessageTimestamp = (sentAt) => {
        const messageDate = new Date(sentAt);
        const today = new Date();

        const isToday = (date) => {
            return date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
        };

        const isYesterday = (date) => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return date.getDate() === yesterday.getDate() &&
                date.getMonth() === yesterday.getMonth() &&
                date.getFullYear() === yesterday.getFullYear();
        };

        if (isToday(messageDate)) {
            return messageDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (isYesterday(messageDate)) {
            return 'Yesterday';
        } else {
            return messageDate.toLocaleDateString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    // Join room when selecting a conversation
    useEffect(() => {
        if (selectedUser) {
            const roomId = [currentUserId, selectedUser.id].sort().join('-');
            socket.emit("join_room", roomId);
        }
    }, [selectedUser]);

    // Listen for real-time messages
    useEffect(() => {
        socket.on("receive_message", (data) => {
            if (selectedUser && data.senderId !== currentUserId) {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    content: data.content,
                    timestamp: formatMessageTimestamp(new Date()),
                    isSender: false
                }]);

                // Update conversations list
                setConversations(prev => prev.map(conv => {
                    if (conv.id === data.senderId) {
                        return {
                            ...conv,
                            lastMessage: data.content,
                            timestamp: formatMessageTimestamp(new Date())
                        };
                    }
                    return conv;
                }));
            }
        });

        return () => socket.off("receive_message");
    }, [selectedUser, currentUserId]);

    // Scroll to bottom when messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch all messages for current user
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`https://flatmate-c9up.onrender.com/api/message/get-all-messages/${currentUserId}`);
                const data = await response.json();

                const conversationsMap = new Map();

                data.forEach(message => {
                    const otherUserId = message.senderId == currentUserId
                        ? message.receiverId
                        : message.senderId;

                    const name = getOtherPersonName(message, currentUserId);

                    if (!conversationsMap.has(otherUserId)) {
                        conversationsMap.set(otherUserId, {
                            id: otherUserId,
                            userName: name,
                            lastMessage: message.content,
                            timestamp: formatMessageTimestamp(message.sentAt),
                            unread: message.senderId !== currentUserId && !message.read,
                        });
                    }
                });

                setConversations([...conversationsMap.values()]);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        if (currentUserId) {
            fetchMessages();
        }
    }, [currentUserId]);

    // Fetch messages for selected conversation
    useEffect(() => {
        const fetchConversationMessages = async () => {
            if (!selectedUser) return;

            try {
                const response = await fetch(`https://flatmate-c9up.onrender.com/api/message/get-message-by-user/${currentUserId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        receiverId: selectedUser.id
                    })
                });

                const data = await response.json();
                setMessages(data.map(msg => ({
                    id: msg.id,
                    content: msg.content,
                    timestamp: formatMessageTimestamp(msg.sentAt),
                    isSender: msg.senderId == currentUserId
                })));
            } catch (error) {
                console.error('Error fetching conversation:', error);
            }
        };

        fetchConversationMessages();
    }, [selectedUser, currentUserId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedUser) return;

        try {
            setLoading(true);
            const response = await fetch('https://flatmate-c9up.onrender.com/api/message/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderId: currentUserId,
                    receiverId: selectedUser.id,
                    content: newMessage
                })
            });

            if (response.ok) {
                const data = await response.json();
                const newMessageObj = {
                    id: data.data.id,
                    content: data.data.content,
                    timestamp: formatMessageTimestamp(new Date()),
                    isSender: true
                };

                setMessages(prev => [...prev, newMessageObj]);

                // Emit the message through socket
                const roomId = [currentUserId, selectedUser.id].sort().join('-');
                socket.emit("send_message", {
                    room: roomId,
                    content: newMessage,
                    senderId: currentUserId,
                    receiverId: selectedUser.id
                });

                // Update conversations list
                setConversations(prev => prev.map(conv => {
                    if (conv.id === selectedUser.id) {
                        return {
                            ...conv,
                            lastMessage: newMessage,
                            timestamp: formatMessageTimestamp(new Date())
                        };
                    }
                    return conv;
                }));

                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow min-h-screen p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
                {/* Conversation List */}
                <div className="md:col-span-1 border rounded-lg">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold text-lg">Messages</h2>
                    </div>
                    <ScrollArea className="h-[calc(100vh-10rem)]">
                        {conversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${selectedUser?.id === conversation.id ? 'bg-gray-50' : ''
                                    }`}
                                onClick={() => setSelectedUser(conversation)}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>
                                            {conversation.userName.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className="font-medium truncate">
                                                {conversation.userName}
                                            </p>
                                            <span className="text-xs text-gray-500">
                                                {conversation.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">
                                            {conversation.lastMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>

                {/* Chat Window */}
                <div className="md:col-span-3 border rounded-lg flex flex-col">
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>
                                            {selectedUser.userName.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{selectedUser.userName}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.isSender ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <Card className={`max-w-[70%] ${message.isSender ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                                                <CardContent className="p-3">
                                                    <p>{message.content}</p>
                                                    <p className={`text-xs ${message.isSender ? 'text-blue-100' : 'text-gray-500'} mt-1`}>
                                                        {message.timestamp}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            {/* Message Input */}
                            <div className="p-4 border-t">
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon">
                                        <ImagePlus className="h-5 w-5" />
                                    </Button>
                                    <Input
                                        placeholder="Type your message..."
                                        className="flex-1"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={loading || !newMessage.trim()}
                                    >
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a conversation to start messaging
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;