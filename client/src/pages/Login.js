import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import axios from 'axios';
import { hideLoading, showLoading } from '../redux/alertsSlice';

function Login() {
  const { loading } = useSelector((state) => state.alerts);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    console.log(localStorage);
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/user/login', values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        toast('Przekierowanie do strony głównej');
        localStorage.setItem('token', response.data.data);
        navigate('/app');
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
        <h1 className="card-title">Witaj ponownie! 🥳</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email"></Input>
          </Form.Item>
          <Form.Item label="Hasło" name="password">
            <Input placeholder="Hasło" type="password"></Input>
          </Form.Item>
          <Button className="primary-button my-2 full-width-button" htmlType="submit">
            Zaloguj się
          </Button>
          <div className="d-flex gap-3">
            <Link to="/reset-password" className="anchor d-block text-center mx-auto">
              Zapomniałeś hasła?
            </Link>
            <Link to="/register" className="anchor d-block text-center mx-auto">
              Zarejestruj się
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;