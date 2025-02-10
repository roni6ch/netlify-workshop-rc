export  const ENV = 'https://staging-prime.navan.com';
export type OnboardingGuides = {
    companyOnboardingGuide?: OnboardingTasks;
    userOnboardingGuide?: OnboardingTasks;
    metadata?: OnboardingMetadata;
};

export type OnboardingTasks = {
    categories?: OnboardingCategory[];
    metadata?: OnboardingMetadata;
};
export type OnboardingMetadata = {
    mandatoryTasksCount: number;
    allMandatoryTasksCompleted: boolean;
};
export type OnboardingCategory = {
    id: string;
    name?: string;
    tasks: Task[];
    state?: CategoryState;
};

export type Task = {
    id: string;
    title?: string;
    state: CategoryState;
    subTasks: Task[] | null;
};

export type CategoryState =
    | 'NOT_STARTED'
    | 'IN_PROGRESS'
    | 'PENDING'
    | 'CONNECTED'
    | 'COMPLETED'
    | 'NOT_COMPLETED';

    export enum AccountType {
        COMPANY = 'COMPANY',
        USER = 'USER',
      }

    export enum TaskId {
        OFFICES_AND_LEGAL_ENTITIES = 'OFFICES_AND_LEGAL_ENTITIES',
        REVIEW_AND_EDIT_POLICY_FOR_TRAVEL = 'REVIEW_AND_EDIT_POLICY_FOR_TRAVEL',
        SET_UP_TRAVEL_PAYMENT = 'SET_UP_TRAVEL_PAYMENT',
        EXPLORE_DASHBOARDS_AND_ANALYTICS = 'EXPLORE_DASHBOARDS_AND_ANALYTICS',
        ADD_USERS = 'ADD_USERS',
        COMPLETE_FIRST_BOOKING = 'COMPLETE_FIRST_BOOKING',
        SEND_USER_INVITATIONS = 'SEND_USER_INVITATIONS',
        SETUP_SSO = 'SETUP_SSO',
        ADD_TRAVELER_INFO = 'ADD_TRAVELER_INFO',
        ADD_LOYALTY_PROGRAMS = 'ADD_LOYALTY_PROGRAMS',
        LEARN_ABOUT_REWARDS = 'LEARN_ABOUT_REWARDS',
        NAVAN_CARD_ADD_INFO = 'NAVAN_CARD_ADD_INFO',
    }
