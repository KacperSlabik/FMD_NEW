import { Button, Form, Input } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { hideLoading, showLoading } from '../redux/alertsSlice';

function ResetPasswordForm() {
	const { token } = useParams();
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [email, setEmail] = useState('');
	const [isPasswordMatch, setIsPasswordMatch] = useState(true);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		try {
			const decodedToken = JSON.parse(atob(token.split('.')[1]));
			const emailFromToken = decodedToken.email;

			setEmail(emailFromToken);
		} catch (error) {
			console.error('Błąd podczas dekodowania tokenu:', error);
			// Dodaj odpowiednie działania w przypadku błędu dekodowania
		}
	}, [token]);

	useEffect(() => {
		setIsPasswordMatch(password === confirmPassword);
	}, [password, confirmPassword]);

	const onFinish = async () => {
		try {
			if (!password || !confirmPassword || !isPasswordMatch) {
				toast.error('Wprowadź poprawne dane');
				return;
			}

			dispatch(showLoading());

			const response = await axios.post('/api/user/set-password', {
				email,
				password,
				token,
			});

			dispatch(hideLoading());

			if (response.data.success) {
				toast.success(response.data.message);
				toast('Przekierowanie do strony logowania');
				navigate('/login');
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			dispatch(hideLoading());
			toast.error('Coś poszło nie tak');
		}
	};

	return (
		<div className='authentication'>
			<div className='authentication-form card p-2'>
				<h1 className='card-title'>Teraz ustaw hasło 😊</h1>
				<Form layout='vertical' onFinish={onFinish}>
					<Form.Item
						label='Nowe hasło'
						name='password'
						rules={[{ required: true, message: 'Proszę podać nowe hasło' }]}
					>
						<Input.Password
							placeholder='Nowe hasło'
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Form.Item>
					<Form.Item
						label='Potwierdź nowe hasło'
						name='confirmPassword'
						dependencies={['password']}
						hasFeedback
						rules={[
							{ required: true, message: 'Proszę potwierdzić nowe hasło' },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('password') === value) {
										return Promise.resolve();
									}
									return Promise.reject('Hasła nie są identyczne');
								},
							}),
						]}
					>
						<Input.Password
							placeholder='Powtórz nowe hasło'
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</Form.Item>
					<Button
						className='primary-button my-2 full-width-button'
						htmlType='submit'
						disabled={!password || !confirmPassword || !isPasswordMatch}
					>
						Zresetuj hasło
					</Button>
				</Form>
			</div>
		</div>
	);
}

export default ResetPasswordForm;
