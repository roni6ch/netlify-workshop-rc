import React, { createContext } from 'react';
import { OnboardingGuides } from '../assets/onboardingGuide.util';

interface TabStateContextType {
    user: { email: string };
    token: string;
    setUser: React.Dispatch<React.SetStateAction<{ email: string }>>;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    onboardingGuide: OnboardingGuides;
    setOnboardingGuide: React.Dispatch<React.SetStateAction<OnboardingGuides>>;
}

export const TabStateContext = createContext<TabStateContextType>({
    user: { email: '' },
    token: '',
    setToken: () => { },
    setUser: () => { },
    onboardingGuide: {},
    setOnboardingGuide: () => { }
}); 