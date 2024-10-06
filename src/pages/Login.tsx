import { useEffect, useState } from 'react';
import PageNav from '../components/PageNav';
import styles from './Login.module.css';
import { useAuth } from '../contexts/FakeAuthentication';
import { useNavigate } from 'react-router-dom';

export default function Login() {

	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const [email, setEmail] = useState('jack@example.com');
	const [password, setPassword] = useState('qwerty');

	useEffect(() => {
		if (isAuthenticated) {
			return navigate('/app', { replace: true });
		}
	}, [isAuthenticated, navigate]);

	function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();

		if (email && password) {
			login(email, password);
		}
	}

	return (
		<main className={styles.login}>
			<PageNav />
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.row}>
					<label htmlFor='email'>Email address</label>
					<input type='email' id='email' onChange={e => setEmail(e.target.value)} value={email} />
				</div>

				<div className={styles.row}>
					<label htmlFor='password'>Password</label>
					<input type='password' id='password' onChange={e => setPassword(e.target.value)} value={password} />
				</div>

				<div>
					<button>Login</button>
				</div>
			</form>
		</main>
	);
}
