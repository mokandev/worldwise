import { useNavigate } from 'react-router-dom';
import { IFakeUser, useAuth } from '../contexts/FakeAuthentication';
import styles from './User.module.css';

function User() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const { avatar, name } = user as IFakeUser;

	function handleClick() {
		logout();
		navigate('/', { replace: true });
	}

	return (
		<div className={styles.user}>
			<img src={avatar} alt={name} />
			<span>Welcome, {name}</span>
			<button onClick={handleClick}>Logout</button>
		</div>
	);
}

export default User;

