import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import { Button, Popconfirm, Table, Tag } from 'antd';
import toast from 'react-hot-toast';
import moment from 'moment';
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
      title: 'Imię i nazwisko',
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
      render: (text, record) => moment(text).format('DD-MM-YYYY HH:mm'),
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
        <div className="d-flex" style={{ gap: '10px' }}>
          {record.status === 'Oczekuje' && (
            <>
              <Popconfirm
                title="Potwierdź DJa"
                description={`Czy na pewno chcesz potwierdzić DJa: ${record.firstName} ${record.lastName}`}
                onConfirm={() => changeDjStatus(record, 'Potwierdzony')}
                okText="Tak"
                cancelText="Nie"
              >
                <Button type="primary">Potwierdź</Button>
              </Popconfirm>

              <Popconfirm
                title="Odrzuć DJa"
                description={`Czy na pewno chcesz odrzucić DJa: ${record.firstName} ${record.lastName}`}
                onConfirm={() => changeDjStatus(record, 'Zablokowany')}
                okText="Tak"
                cancelText="Nie"
              >
                <Button danger>Odrzuć</Button>
              </Popconfirm>
            </>
          )}
          {record.status === 'Potwierdzony' && (
            <Popconfirm
              title="Zablokuj DJa"
              description={`Czy na pewno chcesz zablokować DJa: ${record.firstName} ${record.lastName}`}
              onConfirm={() => changeDjStatus(record, 'Zablokowany')}
              okText="Tak"
              cancelText="Nie"
            >
              <Button danger>Zablokuj</Button>
            </Popconfirm>
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
      <h1 className="page-title">DJe</h1>
      <Table columns={columns} dataSource={djs} />
    </Layout>
  );
}

export default DjsList;
