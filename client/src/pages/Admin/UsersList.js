import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import { Button, Popconfirm, Table } from 'antd';
import moment from 'moment';

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

	const blockUser = async (userId) => {
		try {
			dispatch(showLoading());
			// Wywołaj API do blokowania użytkownika używając userId
			const response = await axios.post(
				'/api/admin/block-user',
				{ userId },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);

			dispatch(hideLoading());

			if (response.data.success) {
				// Zaktualizuj stan users po zablokowaniu użytkownika
				getUsersData();
			} else {
				console.error(response.data.message);
			}
		} catch (error) {
			console.error(error);
			dispatch(hideLoading());
		}
	};

	const deleteUser = async (userId) => {
		try {
			dispatch(showLoading());
			// Wywołaj API do usuwania użytkownika używając userId
			const response = await axios.post(
				'/api/admin/delete-user',
				{ userId },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);

			dispatch(hideLoading());

			if (response.data.success) {
				// Zaktualizuj stan users po usunięciu użytkownika
				getUsersData();
			} else {
				console.error(response.data.message);
			}
		} catch (error) {
			console.error(error);
			dispatch(hideLoading());
		}
	};

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
			render: (text, record) => moment(text).format('DD-MM-YYYY HH:mm'),
		},
		{
			title: 'Akcje',
			dataIndex: 'actions',
			render: (text, record) => (
				<div className='d-flex ' style={{ gap: '10px' }}>
					<Popconfirm
						title='Zablokuj użytkownika'
						description={`Czy na pewno chcesz zablokować użytkownika: ${record.name} ?`}
						onConfirm={blockUser}
						okText='Tak'
						cancelText='Nie'
					>
						<Button danger>Zablokuj</Button>
					</Popconfirm>

					<Popconfirm
						title='Usuń użytkownika'
						description={`Czy na pewno chcesz ununąć użytkownika: ${record.name} ?`}
						onConfirm={deleteUser}
						okText='Tak'
						cancelText='Nie'
					>
						<Button danger>Usuń</Button>
					</Popconfirm>
				</div>
			),
		},
	];
	return (
		<Layout>
			<h1 className='page-title'>Użytkownicy</h1>
			<Table columns={columns} dataSource={users} />
		</Layout>
	);
}

export default UsersList;
