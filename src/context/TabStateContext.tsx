import React, { createContext } from 'react';

interface TabStateContextType {
    user: { email: string };
    token: string;
    setUser: React.Dispatch<React.SetStateAction<{ email: string }>>;
    setToken: React.Dispatch<React.SetStateAction<string>>;
}

export const TabStateContext = createContext<TabStateContextType>({
    user: { email: '' },
    token: '',
    setToken: () => { },
    setUser: () => { }
}); 