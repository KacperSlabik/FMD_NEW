import React, { useEffect } from 'react';
import { Button } from 'antd';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
	const navigate = useNavigate();

	const login = useGoogleLogin({
		onSuccess: async (codeResponse) => {
			console.log('Google Login Success:', codeResponse);

			try {
				const userInfoResponse = await axios.get(
					`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,
					{
						headers: {
							Authorization: `Bearer ${codeResponse.access_token}`,
							Accept: 'application/json',
						},
					}
				);

				const userInfo = userInfoResponse.data;
				console.log('User Info from Google:', userInfo);

				sendUserDataToServer(userInfo);
			} catch (error) {
				console.error('Error fetching user info:', error);
			}
		},
		onError: (error) => console.log('Login Failed:', error),
	});

	const sendUserDataToServer = async (user) => {
		try {
			const response = await axios.post('/api/user/login/auth', user);

			console.log('Server Response:', response.data);

			if (response.data.success) {
				toast.success(response.data.message);
				toast('Przekierowanie do strony głównej');
				localStorage.setItem('token', response.data.data);
				navigate('/app'); // Dodano przekierowanie
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.error('Błąd podczas wysyłania danych do serwera:', error);
		}
	};

	return (
		<Button
			type='button'
			className='google-button d-flex justify-content-center align-items-center full-width-button shadow-sm'
			onClick={() => login()}
		>
			<FcGoogle className='google-icon' />
			Zaloguj się z Google
		</Button>
	);
};

export default Login;
