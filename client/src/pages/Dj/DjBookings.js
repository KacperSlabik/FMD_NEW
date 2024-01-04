import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Button, Table, Tag } from 'antd';
import moment from 'moment';

function DjBookings() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();
  const getBookingsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get('/api/dj/get-bookings-by-dj-id', {
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
      toast.error('Błąd pobrania rezerwacji');
      dispatch(hideLoading());
    }
  };

  const changeBookingStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        '/api/dj/change-booking-status',
        { bookingId: record._id, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getBookingsData();
      }
    } catch (error) {
      toast.error('Błąd zmiany statusu konta DJa');
      dispatch(hideLoading());
    }
  };
  useEffect(() => {
    getBookingsData();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
    },
    {
      title: 'Klient',
      dataIndex: 'name',
      render: (text, record) => <span>{record.userInfo?.name}</span>,
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
    {
      title: 'Akcje',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex">
          {record.status === 'Oczekuje' && (
            <div className="d-flex" style={{ gap: '10px' }}>
              <Button type="primary" onClick={() => changeBookingStatus(record, 'Potwierdzona')}>
                Potwierdź
              </Button>

              <Button danger onClick={() => changeBookingStatus(record, 'Odrzucona')}>
                Odrzuć
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1 className="page-title">Rezerwacje</h1>
      <hr />
      <Table columns={columns} dataSource={bookings} />
    </Layout>
  );
}

export default DjBookings;
