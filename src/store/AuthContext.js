import { createContext, useState } from 'react';

export const AuthContext = createContext({
	token: '',
	isLoggedIn: false,
	login: (token) => {},
	logout: () => {}
});

export function AuthContextProvider({children}) {
	const [token, setToken] = useState(null);
	const userIsLoggedIn = !!token;
  
	function loginHandler(token) {
		setToken(token);
	}

	function logoutHandler() {
		setToken(null);
	}

	const contextValue = {
		token: token,
		isLoggedIn: userIsLoggedIn,
		login: loginHandler,
		logout: logoutHandler
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
}