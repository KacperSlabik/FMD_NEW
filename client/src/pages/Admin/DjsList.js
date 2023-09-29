import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import { Table, Tag } from 'antd';
import toast from 'react-hot-toast';
function DjsList() {
	const [djs, setDjs] = useState([]);
	const dispatch = useDispatch();
	const getDjsData = async () => {
		try {
			dispatch(showLoading());
			const response = await axios.get('/api/admin/get-all-djs', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			dispatch(hideLoading());
			if (response.data.success) {
				setDjs(response.data.data);
			}
		} catch (error) {
			console.log(error);
			dispatch(hideLoading());
		}
	};

	const columns = [
		{
			title: 'Imię',
			dataIndex: 'firstName',
			render: (text, record) => (
				<span>
					{record.firstName} {record.lastName}
				</span>
			),
		},
		{
			title: 'Email',
			dataIndex: 'email',
		},
		{
			title: 'Telefon',
			dataIndex: 'phoneNumber',
		},
		{
			title: 'Utworzony',
			dataIndex: 'createdAt',
		},
		{
			title: 'Status',
			dataIndex: 'status',
			render: (text, record) => {
				let tagType = '';

				switch (text) {
					case 'Potwierdzony':
						tagType = 'success';
						break;
					case 'Oczekuje':
						tagType = 'warning';
						break;
					case 'Zablokowany':
						tagType = 'error';
						break;
					default:
						tagType = 'default';
						break;
				}

				return <Tag color={tagType}>{text}</Tag>;
			},
		},
		{
			title: 'Akcje',
			dataIndex: 'actions',
			render: (text, record) => (
				<div className='d-flex'>
					{record.status === 'Oczekuje' && (
						<h1
							className='anchor'
							onClick={() => changeDjStatus(record, 'Potwierdzony')}
						>
							Potwierdź
						</h1>
					)}
					{record.status === 'Potwierdzony' && (
						<h1
							className='anchor'
							onClick={() => changeDjStatus(record, 'Zablokowany')}
						>
							Zablokuj
						</h1>
					)}
				</div>
			),
		},
	];

	const changeDjStatus = async (record, status) => {
		try {
			dispatch(showLoading());
			const response = await axios.post(
				'/api/admin/change-dj-account-status',
				{ djId: record._id, userId: record.userId, status: status },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			dispatch(hideLoading());
			if (response.data.success) {
				toast.success(response.data.message);
				getDjsData();
			}
		} catch (error) {
			toast.error('Błąd zmiany statusu konta DJa');
			dispatch(hideLoading());
		}
	};

	useEffect(() => {
		getDjsData();
	}, []);
	return (
		<Layout>
			<h1 className='page-title'>DJe</h1>
			<Table columns={columns} dataSource={djs} />
		</Layout>
	);
}

export default DjsList;
