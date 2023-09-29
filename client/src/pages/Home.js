import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Dj from '../components/Dj';
import { Col, Row, Divider } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Home() {
	const [djs, setDjs] = useState([]);
	const { user } = useSelector((state) => state.user);
	const navigate = useNavigate();

	if (user?.isAdmin) navigate('/app/admin/home');

	const getData = async () => {
		try {
			const response = await axios.get('/api/user/get-all-djs', {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			});
			if (response.data.success) setDjs(response.data.data);
		} catch (error) {}
	};
	useEffect(() => {
		getData();
	}, []);

	return (
		<Layout>
			<h1 className='text-center'>Strona Główna</h1>

			<Row gutter={20}>
				<Divider orientation='left' orientationMargin='0'>
					<h2 className='mb-2'>Dje</h2>
				</Divider>
				{djs.map((dj) => (
					<Col span={8} xs={24} sm={24} lg={8} key={dj._id}>
						<Dj dj={dj} />
					</Col>
				))}
			</Row>
		</Layout>
	);
}

export default Home;
