import { createContext, useEffect, useState } from 'react';

let logoutTimer;
export const AuthContext = createContext({
	token: '',
	isLoggedIn: false,
	login: (token) => {},
	logout: () => {}
});

function calculateRemainingTime (expirationTime){
	const currentTime = new Date().getTime();
	const adjExpirationTime = new Date(expirationTime).getTime();
	const remainingDuration = adjExpirationTime - currentTime;
	return remainingDuration;
}

function retrieveStoredToken() {
	const storedToken = localStorage.getItem('@auth-react:token');
	const storedExpirationDate = localStorage.getItem('@auth-expiration-time');
	const remainingTime = calculateRemainingTime(storedExpirationDate);
	
	if(remainingTime <= 6000){
		localStorage.removeItem('@auth-react:token');
		localStorage.removeItem('@auth-expiration-time');
		return null;
	}

	return {
		token:  storedToken,
		duration: remainingTime
	};
}

export function AuthContextProvider({children}) {
	const tokenData = retrieveStoredToken();
	let initialToken;
	if(tokenData){
		initialToken = tokenData.token;
	}
	const [token, setToken] = useState(initialToken);
	const userIsLoggedIn = !!token;
  
	function logoutHandler() {
		setToken(null);
		localStorage.removeItem('@auth-react:token');
		localStorage.clear();
		if(logoutTimer)
			clearTimeout(logoutTimer);
	}

	function loginHandler(token, expirationTime) {
		setToken(token);
		localStorage.setItem('@auth-react:token', token);
		localStorage.setItem('@auth-expiration-time', expirationTime);
		const remainingTime = calculateRemainingTime(expirationTime);
		logoutTimer = setTimeout(logoutHandler, remainingTime);
	}

	useEffect(() => {
		if(tokenData){
			console.log(tokenData.duration);
			logoutTimer = setTimeout(logoutHandler, tokenData.duration);
		}
	}, [tokenData]);

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