import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function VerifyEmail() {
	const { token } = useParams();
	const navigate = useNavigate();
	const [verificationResult, setVerificationResult] = useState('');

	useEffect(() => {
		const verifyEmail = async () => {
			try {
				const response = await axios.get(`/api/user/verify-email/${token}`);
				console.log('Verification response:', response.data); // Dodaj ten log
				setVerificationResult(response.data.message);
				toast.success(response.data.message);
				setTimeout(() => {
					navigate('/login');
				}, 5000); // Przekierowanie do logowania po 5 sekundach
			} catch (error) {
				console.error(error);
				setVerificationResult('Błąd weryfikacji e-maila');
				toast.error('Błąd weryfikacji e-maila');
				setTimeout(() => {
					navigate('/');
				}, 5000); // Przekierowanie na stronę główną po 5 sekundach w przypadku błędu
			}
		};

		verifyEmail();
	}, [token, navigate]);

	return (
		<div className='verification-message-container'>
			<p>{verificationResult}</p>
			<p>Proszę czekać...</p>
		</div>
	);
}

export default VerifyEmail;
