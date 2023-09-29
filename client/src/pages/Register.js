import { Button, Form, Input, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/user/register', values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        toast('Przekierowanie do strony logowania');
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Coś poszło nie tak');
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card p-2">
        <h1 className="card-title">Witaj imprezowiczu! 🎉</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Imię" name="name">
            <Input placeholder="Imię"></Input>
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email"></Input>
          </Form.Item>
          <Form.Item label="Hasło" name="password">
            <Input placeholder="Hasło" type="password"></Input>
          </Form.Item>
          <Button className="primary-button my-2 full-width-button" htmlType="submit">
            Zarejestruj się
          </Button>

          <Link to="/login" className="anchor d-block text-center mt-2">
            Powrót do logowania
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Register;
