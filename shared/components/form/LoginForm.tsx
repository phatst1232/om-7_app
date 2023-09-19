'user client';

import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Image, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { DASHBOARD_PATH } from '@/shared/common/app-route';
import { getToken } from '@/lib/action/auth-action';
import { GoogleOutlined } from '@ant-design/icons';
import { signIn } from 'next-auth/react';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [isCorrectPassword, setIsCorrectPassword] = useState(true);
  const [isValidUsername, setIsValidUsername] = useState(true);

  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);
    const dataRes = await signIn('credentials', {
      redirect: false,
      username: values.username,
      password: values.password,
    });
    if (dataRes?.error) {
      if (dataRes.error === 'Invalid password') {
        setIsCorrectPassword(false);
      }
      if (dataRes.error === 'User not found') {
        setIsValidUsername(false);
      }
      form.validateFields();
    }
    if (dataRes?.ok) {
      router.push(DASHBOARD_PATH);
      // localStorage.setItem('token', dataRes);
    } else {
    }
  };

  const onPwChange = () => {
    setIsCorrectPassword(true);
  };
  const onUsernameChange = () => {
    setIsValidUsername(true);
  };

  const handleLoginGoogle = () => {
    //not yet
  };

  return (
    <Form
      name='normal_login'
      className='login-form'
      style={{
        maxWidth: '300px',
        textAlign: 'center',
      }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        style={{ textAlign: 'left' }}
        name='username'
        validateStatus={isValidUsername ? '' : 'error'}
        rules={[{ required: true, message: 'Please input your Username!' }]}
        help={isValidUsername ? null : 'User not exist!'}
      >
        <Input
          onChange={onUsernameChange}
          prefix={<UserOutlined className='site-form-item-icon' />}
          placeholder='Username'
        />
      </Form.Item>
      <Form.Item
        style={{ textAlign: 'left' }}
        name='password'
        // hasFeedback
        validateStatus={isCorrectPassword ? '' : 'error'}
        help={isCorrectPassword ? null : 'Invalid password'}
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className='site-form-item-icon' />}
          type='password'
          placeholder='Password'
          onChange={onPwChange}
        />
      </Form.Item>
      <Form.Item style={{ maxHeight: 30 }}>
        <Form.Item
          name='remember'
          valuePropName='checked'
          style={{ float: 'left' }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a
          className='login-form-forgot'
          style={{ float: 'right', marginTop: 5 }}
          href=''
        >
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit' block>
          Log in
        </Button>
        <Button
          type='primary'
          // htmlType="submit"
          onClick={handleLoginGoogle}
          block
          icon={<GoogleOutlined />}
          style={{
            marginTop: 5,
            backgroundColor: '#cf4332',
            textAlign: 'center',
          }}
        >
          Log in Google
        </Button>
        Or{' '}
        <a style={{ color: 'blue' }} href='/dashboard'>
          register now!
        </a>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
