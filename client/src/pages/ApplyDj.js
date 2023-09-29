import Layout from '../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DjForm from '../components/DjForm';

function ApplyDj() {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const onFinish = async (values) => {
		try {
			console.log('Success:', values);
			dispatch(showLoading());
			const response = await axios.post(
				'/api/user/apply-dj-account',
				{
					...values,
					userId: user._id,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			dispatch(hideLoading());
			if (response.data.success) {
				toast.success(response.data.message);
				navigate('/');
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			dispatch(hideLoading());
			toast.error('Coś poszło nie tak');
		}
	};

	return (
		<Layout>
			<h1 className='page-title'>Dodaj DJ'a</h1>
			<hr />

			<DjForm onFinish={onFinish} />
		</Layout>
	);
}

export default ApplyDj;
