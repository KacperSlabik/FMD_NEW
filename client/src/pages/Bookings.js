import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../components/Layout';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Table, Tag } from 'antd';
import moment from 'moment';

function Bookings() {
	const [bookings, setBookings] = useState([]);
	const dispatch = useDispatch();
	const getBookingsData = async () => {
		try {
			dispatch(showLoading());
			const response = await axios.get('/api/user/get-bookings-by-user-id', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			dispatch(hideLoading());
			if (response.data.success) {
				toast.success(response.data.message);
				setBookings(response.data.data);
			}
		} catch (error) {
			toast.error();
			dispatch(hideLoading());
		}
	};

	const columns = [
		{
			title: 'ID',
			dataIndex: '_id',
		},
		{
			title: 'DJ',
			dataIndex: 'name',
			render: (text, record) => (
				<span>
					{record.djInfo?.firstName} {record.djInfo?.lastName}
				</span>
			),
		},
		{
			title: 'Nr. Telefonu',
			dataIndex: 'phoneNumber',
			render: (text, record) => <span>{record.djInfo?.phoneNumber}</span>,
		},
		{
			title: 'Data i czas imprezy',
			dataIndex: 'createdAt',
			render: (text, record) => (
				<span>
					Rozpoczęcie: {moment(record?.startDate).format('DD-MM-YYYY HH:mm')}
					<br></br>
					Zakończenie: {moment(record?.endDate).format('DD-MM-YYYY HH:mm')}
				</span>
			),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			render: (text, record) => {
				let tagType = '';

				switch (text) {
					case 'Potwierdzona':
						tagType = 'success';
						break;
					case 'Oczekuje':
						tagType = 'warning';
						break;
					case 'Odrzucona':
						tagType = 'error';
						break;
					default:
						tagType = 'default';
						break;
				}

				return <Tag color={tagType}>{text}</Tag>;
			},
		},
	];
	useEffect(() => {
		getBookingsData();
	}, []);
	return (
		<Layout>
			<h1 className='page-title'>Rezerwacje</h1>
			<hr />
			<Table columns={columns} dataSource={bookings} />
		</Layout>
	);
}

export default Bookings;
