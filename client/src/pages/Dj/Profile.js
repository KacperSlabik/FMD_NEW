import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DjForm from '../../components/DjForm';
import Layout from '../../components/Layout';
import { useEffect, useState } from 'react';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const [dj, setDj] = useState(null);

  const getDjData = async () => {
    try {
      dispatch(showLoading());
      console.log(localStorage.getItem('token'));
      const response = await axios.post(
        '/api/dj/get-dj-info-by-user-id',
        { userId: params.userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      console.log(response.data.data);
      if (response.data.success) {
        setDj(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDjData();
  }, []);

  const onFinish = async (values) => {
    console.log(values);

    try {
      console.log('Success:', values);
      dispatch(showLoading());
      const response = await axios.post(
        '/api/dj/update-dj',
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
        window.location.reload(false);
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
      <h1 className="page-title">Profil</h1>
      <hr />
      {dj && <DjForm onFinish={onFinish} initialValues={dj} />}
    </Layout>
  );
}
