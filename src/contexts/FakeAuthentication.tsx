import { createContext, FC, ReactNode, useContext, useReducer } from 'react';

interface IContext {
	user: IFakeUser | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => void;
	logout: () => void;
}

const defaultContextValue: IContext = {
	user: null,
	isAuthenticated: false,
	login: () => {},
	logout: () => {},
};

const AuthContext = createContext<IContext>(defaultContextValue);

interface IAuthProviderProps {
	children: ReactNode;
}

interface IState {
	user: null | IFakeUser;
	isAuthenticated: boolean;
}

export interface IFakeUser {
	name: string;
	email: string;
	password: string;
	avatar: string;
}

interface IAction {
	type: 'login' | 'logout';
	payload?: IFakeUser | null;
}

const initialState: IState = {
	user: null,
	isAuthenticated: false,
};

function reducer(state: IState, action: IAction): IState {
	switch (action.type) {
		case 'login':
			return {
				...state,
				user: action.payload ? action.payload : null,
				isAuthenticated: true,
			};

		case 'logout':
			return {
				...state,
				user: null,
				isAuthenticated: false,
			};

		default:
			throw new Error('Unknown action type');
	}
}

const FAKE_USER: IFakeUser = {
	name: 'Jack',
	email: 'jack@example.com',
	password: 'qwerty',
	avatar: 'https://i.pravatar.cc/100?u=zz',
};

const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
	const [{ user, isAuthenticated }, dispatch] = useReducer(reducer, initialState);

	function login(email: string, password: string) {
		if (email === FAKE_USER.email && password === FAKE_USER.password) {
			dispatch({ type: 'login', payload: FAKE_USER });
		}
	}

	function logout() {
		dispatch({ type: 'logout' });
	}

	return <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>{children}</AuthContext.Provider>;
};

function useAuth() {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error('AuthContext was used outsied of AuthProvider');
	}

	return context;
}

export { AuthProvider, useAuth };
