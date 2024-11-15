import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import { LoginAction } from '../redux/Action/Auth';
import './AuthPage.css';

const Login = () => {
	const [form, setForm] = useState({
		email: '',
		password: '',
	});

	const authError = useSelector(state => state.auth.authError);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onChangeHandler = e => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmit = async e => {
		e.preventDefault();
		console.log('Submitting form:', form);
		const response = await dispatch(LoginAction(form));
		console.log('Response from API:', response);

		if (response.success) {
			switch (response.user.role) {
				case 'ADMIN':
					navigate('/admin');
					break;
				case 'SERVICE_PROVIDER':
					navigate('/provider');
					break;
				case 'CLIENT':
					navigate('/');
					break;
				default:
					navigate('/');
			}
		} else {
			console.error('Login failed or response is undefined');
		}
	};

	return (
		<div>
			
			<div className='auth-page-container'>
				<div className='auth-page'>
					<h2>Se connecter</h2>
					{authError && <div className='error-message'>{authError}</div>}
					<form onSubmit={onSubmit}>
						<input
							type='email'
							name='email'
							placeholder='Email'
							value={form.email}
							onChange={onChangeHandler}
							required
						/>
						<input
							type='password'
							name='password'
							placeholder='Mot de passe'
							value={form.password}
							onChange={onChangeHandler}
							required
						/>
						<button type='submit'>Se connecter</button>
					</form>
					<p>
						<p>
							Mot de passe oublié ?{' '}
							<Link to='/request-reset-password'>Réinitialiser le mot de passe</Link>
						</p>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
