import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import { Table } from 'antd';

function UsersList() {
	const [users, setUsers] = useState([]);
	const dispatch = useDispatch();
	const getUsersData = async () => {
		try {
			dispatch(showLoading());
			const response = await axios.get('/api/admin/get-all-users', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			dispatch(hideLoading());
			if (response.data.success) {
				setUsers(response.data.data);
			}
		} catch (error) {
			console.log(error);
			dispatch(hideLoading());
		}
	};
	useEffect(() => {
		getUsersData();
	}, []);

	const columns = [
		{
			title: 'Imię',
			dataIndex: 'name',
		},
		{
			title: 'Email',
			dataIndex: 'email',
		},
		{
			title: 'Utworzony',
			dataIndex: 'createdAt',
		},
		{
			title: 'Akcje',
			dataIndex: 'actions',
			render: (text, record) => (
				<div className='d-flex'>
					<h1 className='anchor'>Zablokuj</h1>
				</div>
			),
		},
	];
	return (
		<Layout>
			<h1 className='page-title'>Uzytkownicy</h1>
			<Table columns={columns} dataSource={users} />
		</Layout>
	);
}

export default UsersList;
