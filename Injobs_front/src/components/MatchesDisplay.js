import React from "react";

const matches = [
  { id: 1, name: "Richard Denver", imageUrl: "https://i.imgur.com/CKmWtzT.png" },
  { id: 2, name: "Bob Chay", imageUrl: "https://i.imgur.com/CKmWtzT.png" },
  { id: 3, name: "Charlie Masondasdasda dasdasdasdas", imageUrl: "https://i.imgur.com/CKmWtzT.png" },
  { id: 4, name: "Dana", imageUrl: "https://i.imgur.com/CKmWtzT.png" },
  { id: 5, name: "Eve", imageUrl: "https://i.imgur.com/CKmWtzT.png" },
];

const MatchesDisplay = ({ setClickedUser }) => {
    return (
        <div className="matches-display">
            {matches.map((match) => {
                const nameParts = match.name.split(" ");
                const firstInitial = nameParts[0].charAt(0); // Primeira letra do primeiro nome
                const lastInitial = nameParts[nameParts.length - 1].charAt(0); // Primeira letra do último nome

                return (
                    <div 
                        key={match.id} 
                        className="match-card"
                        onClick={() => setClickedUser(match)}
                    >
                        <div className="match-initial">
                            {firstInitial}{lastInitial} {/* Exibe a inicial do primeiro e último nome */}
                        </div>
                        <p className="match-name">{match.name}</p> {/* Classe para aplicar o estilo de truncamento */}
                    </div>
                );
            })}
        </div>
    );
}


export default MatchesDisplay;
