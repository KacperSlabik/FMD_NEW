import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function VerifyEmail() {
	const { token } = useParams();
	const navigate = useNavigate();
	const [isVerified, setVerified] = useState(false);

	useEffect(() => {
		const verifyEmail = async () => {
			try {
				const response = await axios.get(
					`/api/user/verify-email?token=${token}`
				);
				toast.success(response.data.message, { duration: 5000 });
				setVerified(true);
			} catch (error) {
				toast.error('Błąd weryfikacji e-maila');
				navigate('/'); // Przekieruj gdziekolwiek, jeśli weryfikacja nie powiedzie się
			}
		};

		verifyEmail();
	}, [token, navigate]);

	useEffect(() => {
		let redirectTimer;
		if (isVerified) {
			// Ustaw timer na 5 sekund
			redirectTimer = setTimeout(() => {
				navigate('/login'); // Przekieruj użytkownika na stronę logowania po weryfikacji
			}, 5000);
		}

		// Wyczyść timer, gdy komponent jest odmontowany
		return () => clearTimeout(redirectTimer);
	}, [isVerified, navigate]);

	return (
		<div className='verification-container'>
			{isVerified && (
				<div className='verification-message'>
					<p>Email został pomyślnie zweryfikowany.</p>
					<p>Zostaniesz przekierowany do strony logowania za 5 sekund.</p>
				</div>
			)}
		</div>
	);
}

export default VerifyEmail;
