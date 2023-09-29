import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import axios from 'axios';
import { hideLoading, showLoading } from '../redux/alertsSlice';

function ResetPassword() {
  const { loading } = useSelector((state) => state.alerts);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    console.log(values);

    if (values.password !== values.passwordRepeat) {
      toast.error('Hasła nie są zgodne.');
      return;
    }

    console.log(localStorage);
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/user/reset-password', values);
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
        <h1 className="card-title">Zapomiałeś hasła? 😂</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email"></Input>
          </Form.Item>
          <Form.Item label="Nowe hasło" name="password">
            <Input placeholder="Hasło" type="password"></Input>
          </Form.Item>

          <Form.Item label="Powtórz hasło" name="passwordRepeat">
            <Input placeholder="Hasło" type="password"></Input>
          </Form.Item>
          <Button className="primary-button my-2 full-width-button" htmlType="submit">
            Zresetuj hasło
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default ResetPassword;
