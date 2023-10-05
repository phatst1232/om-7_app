import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Radio,
  Space,
  Tag,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from 'antd';
import { getAllRoles, useRegisterNewUser } from '@/lib/action/user-action';
import { RegisterUserDto, Role, User } from '@/lib/dto/dashboard-dtos';
import {
  LoadingOutlined,
  PlusOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { UploadChangeParam, RcFile } from 'antd/es/upload';
import { NoticeType } from 'antd/es/message/interface';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const RegisterForm: React.FC = () => {
  const [registerForm] = Form.useForm();
  const [loading, setLoading] = useState();
  const [userToRegister, setUserToRegister] = useState<RegisterUserDto>(
    {} as RegisterUserDto
  );

  const [messageApi, msgContextHolder] = message.useMessage();
  const openMessage = (type: NoticeType, content?: string) => {
    messageApi.open({
      type: type,
      content: content ? content : '',
    });
  };

  const { registerResult, registeringUser, registerError, doRegisterNewUser } =
    useRegisterNewUser(userToRegister);

  const callRegister = async (user: User) => {
    if (user.username) {
      user.roles = pickedRoles;
      setUserToRegister(user);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    if (userToRegister.username) doRegisterNewUser();
  }, [userToRegister]);

  // handle New User result
  useEffect(() => {
    if (!userToRegister.username) {
      return;
    }
    if (!registerError && registerResult?.data) {
      openMessage(
        'info',
        registerResult?.data.username
          ? `New user registerd! username: ${registerResult?.data.username}`
          : 'New user registerd!'
      );
      // setOpen(false);
      registerForm.resetFields();
      setPickedRoles([]);
      return;
    }
    if (registerError?.response.data.message) {
      openMessage(
        'error',
        `Register user error: ${registerError.response.data.message}`
      );
      // message.error(registerError.response.data.message);
    } else {
      openMessage('error', `Error: Unknown`);
    }
  }, [registerError, registerResult]);
  const handleCancel = () => {
    // return to login || login to dashboard
    registerForm.resetFields();
    setPickedRoles([]);
  };

  // add permission
  const [items, setItems] = useState<MenuProps['items']>([]);
  const [listRole, setListRole] = useState<Role[]>([]);

  const [pickedRoles, setPickedRoles] = useState<Role[]>([]);

  const handleClose = (perId: string) => {
    const newTags = pickedRoles.filter((role) => role.id !== perId);
    console.log(newTags);
    setPickedRoles(newTags);
  };

  // upload avt
  const [avtLoading, setAvtLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const handleAvtChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setAvtLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setAvtLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <>
      <Form
        name='basic'
        form={registerForm}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={
          {
            // maxWidth: 580,
            // marginLeft: '2rem',
            // marginRight: '2rem',
            // marginTop: '2rem',
            // width: '100%',
          }
        }
        initialValues={{ remember: true }}
        onFinish={callRegister}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item<User>
          // label='Avatar'
          name='image'
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginLeft: 16,
          }}
        >
          {/* <Input value={'Have not Implement, yet'}></Input> */}
          <Upload
            name='avatar'
            listType='picture-circle'
            className='avatar-uploader'
            showUploadList={false}
            action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
            beforeUpload={beforeUpload}
            onChange={handleAvtChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt='avatar' style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item<User>
          label='User Name'
          name='username'
          rules={[
            { required: true, message: 'Please input username!' },
            {
              pattern: /^[a-zA-Z0-9_]+$/,
              message:
                'Username can contain only letters, digits, and underscores!',
            },
            {
              pattern: /^.{3,20}$/,
              message:
                'Username must be between 3 and 20 characters in length!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<User>
          label='Full Name'
          name='fullName'
          rules={[{ required: true, message: 'Please input Full Name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<User>
          label='Gender'
          name='gender'
          rules={[{ required: true, message: 'Please choose a Gender!' }]}
        >
          <Radio.Group style={{ marginLeft: '1rem' }}>
            <Radio value={true}> Male </Radio>
            <Radio value={false}> Female </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<User> label='Date of Birth' name='dateOfBirth'>
          <DatePicker showToday={false} />
        </Form.Item>
        <Form.Item<User>
          label='Email'
          name='email'
          rules={[
            { required: true, message: 'Please input email!' },
            {
              pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              message: 'Invalid email!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<User>
          label='Phone'
          name='phone'
          rules={[
            {
              pattern: /^(03|05|07|08|09)\d{8}$/,
              message: 'Invalid phone number!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Button
              key='submit'
              // type='link'
              icon={<RollbackOutlined />}
              style={{ marginRight: '13rem' }}
              onClick={() => registerForm.resetFields()}
            >
              Cancel
            </Button>
            <Button
              key='submit'
              type='primary'
              loading={loading}
              htmlType='submit'
            >
              Register
            </Button>
          </Space>
        </Form.Item>
        <Form.Item<User> name='password'>
          <input hidden value='default' />
        </Form.Item>
      </Form>
    </>
  );
};

export default () => <RegisterForm />;
