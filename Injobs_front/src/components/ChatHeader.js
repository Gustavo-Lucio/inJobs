import { useCookies } from 'react-cookie'

const db = [
    {
        name: 'Richard Hendricks',
        url: 'https://i.imgur.com/9kugbS1.jpeg',
        formation: 'Analista de Dados'
    },
    {
        name: 'Erlich Bachman',
        url: 'https://i.imgur.com/jfQLzd3.png',
        formation: 'Analista de Dados'
    },
    {
        name: 'Monica Hall',
        url: 'https://i.imgur.com/9kugbS1.jpeg',
        formation: 'Analista de Dados'
    },
    {
        name: 'Jared Dunn',
        url: 'https://i.imgur.com/9kugbS1.jpeg',
        formation: 'Analista de Dados'
    },
    {
        name: 'Dinesh Chugtai',
        url: 'https://i.imgur.com/9kugbS1.jpeg',
        formation: 'Analista de Dados'
    }
]

const ChatHeader = () => {
    const user = db;

    // Obtenção das iniciais do primeiro e último nome
    const nameParts = user[0].name.split(" ");
    const firstInitial = nameParts[0].charAt(0); // Primeira letra do primeiro nome
    const lastInitial = nameParts[nameParts.length - 1].charAt(0); // Primeira letra do último nome

    return (
        <div className="chat-container-header">
            <div className="profile">
                <div className="img-container">
                    <div className="match-initial-header">
                        {firstInitial}{lastInitial} {/* Exibe as iniciais */}
                    </div>
                </div>
                <h3>{user[0].name}</h3>
            </div>
        </div>
    )
}

export default ChatHeader;