import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import ChatInput from './ChatInput';

const db = [
    {
        name: 'Richard Hendricks',
        url: 'https://i.imgur.com/9kugbS1.jpeg',
        message: 'Hello!',
        timestamp: '2024-06-08T10:00:00Z'
    },
    {
        name: 'Erlich Bachman',
        url: 'https://i.imgur.com/9kugbS1.jpeg',
        message: 'How are you?',
        timestamp: '2024-06-08T10:05:00Z'
    },
    {
        name: 'Monica Hall',
        url: 'https://i.imgur.com/9kugbS1.jpeg',
        message: 'Good morning!',
        timestamp: '2024-06-08T10:10:00Z'
    },
    {
        name: 'Jared Dunn',
        url: 'https://i.imgur.com/9kugbS1.jpeg',
        message: 'What’s up?',
        timestamp: '2024-06-08T10:15:00Z'
    },
    {
        name: 'Dinesh Chugtai',
        url: 'https://i.imgur.com/9kugbS1.jpeg',
        message: 'Hey there!',
        timestamp: '2024-06-08T10:20:00Z'
    }
];

const ChatDisplay = ({ user, clickedUser }) => {
    const userId = user?.user_id;
    const clickedUserId = clickedUser?.user_id;
    const [usersMessages, setUsersMessages] = useState([]);
    const [clickedUsersMessages, setClickedUsersMessages] = useState([]);

    const getUsersMessages = () => {
        // Filtra as mensagens do usuário logado
        const userMessages = db.filter(message => message.name === user?.first_name);
        setUsersMessages(userMessages);
    };

    const getClickedUsersMessages = () => {
        // Filtra as mensagens do usuário clicado
        const clickedMessages = db.filter(message => message.name === clickedUser?.first_name);
        setClickedUsersMessages(clickedMessages);
    };

    useEffect(() => {
        getUsersMessages();
        getClickedUsersMessages();
    }, [user, clickedUser]);

    const messages = [];

    usersMessages?.forEach(message => {
        const formattedMessage = {};
        formattedMessage['name'] = user?.nome_candidato;
        formattedMessage['img'] = user?.url;
        formattedMessage['message'] = message.message;
        formattedMessage['timestamp'] = message.timestamp;
        messages.push(formattedMessage);
    });

    clickedUsersMessages?.forEach(message => {
        const formattedMessage = {};
        formattedMessage['name'] = clickedUser?.nome_candidato;
        formattedMessage['img'] = clickedUser?.url;
        formattedMessage['message'] = message.message;
        formattedMessage['timestamp'] = message.timestamp;
        messages.push(formattedMessage);
    });

    const descendingOrderMessages = messages?.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    return (
        <>
            <Chat descendingOrderMessages={descendingOrderMessages} />
            <ChatInput
                user={user}
                clickedUser={clickedUser}
                getUserMessages={getUsersMessages}
                getClickedUsersMessages={getClickedUsersMessages}
            />
        </>
    );
};

export default ChatDisplay;
