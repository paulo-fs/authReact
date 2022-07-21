import { useContext, useRef } from 'react';
import { AuthContext } from '../../store/AuthContext';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
	const newPasswordInputRef = useRef();
	const authCtx = useContext(AuthContext);

	function submitHandler(event){
		event.preventDefault();
		const enteredNewPassword = newPasswordInputRef.current.value;
		fetch(
			'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAyCyySAebk0DFtXeiA9Ps2DOSEc76wMpI',
			{
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					idToken: authCtx.token,
					password: enteredNewPassword,
					returnSecureToken: false
				})
			}
		).then(res => {
			console.log(res);
		});
	}

	return (
		<form className={classes.form} onSubmit={submitHandler}>
			<div className={classes.control}>
				<label htmlFor='new-password'>New Password</label>
				<input type='password' minLength="7" id='new-password' ref={newPasswordInputRef} />
			</div>
			<div className={classes.action}>
				<button>Change Password</button>
			</div>
		</form>
	);
};

export default ProfileForm;
