import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [companyId, setCompanyId] = useState(null);

  // Recuperar o companyId do localStorage quando o componente for montado
  useEffect(() => {
    try {
      const storedCompanyId = localStorage.getItem('companyId');
      if (storedCompanyId) {
        setCompanyId(storedCompanyId); // Atualiza o estado com o ID da empresa armazenado
      }
    } catch (error) {
      console.error('Erro ao acessar localStorage:', error);
    }
  }, []); // O efeito será executado apenas uma vez quando o componente for montado

  // Salvar o companyId no localStorage sempre que ele for alterado
  useEffect(() => {
    if (companyId !== null) {
      try {
        localStorage.setItem('companyId', companyId); // Armazena o companyId no localStorage
      } catch (error) {
        console.error('Erro ao acessar localStorage:', error);
      }
    }
  }, [companyId]); // O efeito será executado toda vez que o companyId mudar

  const logout = () => {
    setCompanyId(null);
    localStorage.removeItem('companyId'); // Remove o companyId do localStorage
  };

  return (
    <UserContext.Provider value={{ companyId, setCompanyId, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }

  return context;
};
