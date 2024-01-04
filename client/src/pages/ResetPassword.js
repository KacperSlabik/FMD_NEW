import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import axios from 'axios';
import { hideLoading, showLoading } from '../redux/alertsSlice';

function ResetPassword() {
	const [email, setEmail] = useState('');
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onFinish = async () => {
		try {
			dispatch(showLoading());

			const response = await axios.post('/api/user/reset-password', {
				email,
			});

			dispatch(hideLoading());

			if (response.data.success) {
				toast.success(response.data.message);
				navigate(`/reset-password`);
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
				<h1 className='card-title'>Zapomiałeś hasła? 😂</h1>
				<Form layout='vertical' onFinish={onFinish}>
					<Form.Item
						label='Email'
						name='email'
						rules={[{ required: true, message: 'Proszę podać adres email' }]}
					>
						<Input
							placeholder='Email'
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Form.Item>
					<Button
						className='primary-button my-2 full-width-button'
						htmlType='submit'
					>
						Zresetuj hasło
					</Button>
				</Form>
			</div>
		</div>
	);
}

export default ResetPassword;
