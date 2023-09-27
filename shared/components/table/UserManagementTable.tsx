'use client';
import {
  callUpdateUser,
  callDeleteUser,
  useSearchUserList,
  getAllRoles,
  useCreateUser,
} from '@/lib/action/user-action';
import { CreateUserDto, Role, User } from '@/lib/dto/dashboard-dtos';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Input,
  Table,
  Switch,
  Button,
  Form,
  Popconfirm,
  Space,
  Tag,
  InputNumber,
  Select,
  Spin,
  Dropdown,
  Modal,
  MenuProps,
  message,
  Radio,
  DatePicker,
} from 'antd'; // Import Switch from Ant Design
import { NoticeType } from 'antd/es/message/interface';
import { TableProps } from 'antd/es/table';
import Upload, {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from 'antd/es/upload';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

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

function UserManagementTable() {
  const { data: session, status } = useSession();
  if (
    !session ||
    status !== 'authenticated' ||
    typeof session.user.accessToken !== 'string'
  ) {
    return;
  }
  const token = session?.user.accessToken || '';
  const [searchData, setSearchData] = useState('');
  const [userToCreate, setUserToCreate] = useState<CreateUserDto>(
    {} as CreateUserDto
  );
  const router = useRouter();
  //swr api create
  const {
    users,
    isMutating: loadingUser,
    searchUserError,
    triggerSearchUser,
  } = useSearchUserList(searchData, token);

  const { createResult, creatingUser, createError, doCreateUser } =
    useCreateUser(userToCreate, token);
  // await callCreateUser();

  console.log('Users: ', users);
  const handleChange = (value: string[]) => {
    form.setFieldValue('gender', value);
  };

  type FixedType = 'left' | 'right' | boolean;
  const leftFixed: FixedType = 'left';
  const rightFixed: FixedType = 'right';

  const userColsConfig = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 0,
      width: 100,
      fixed: leftFixed,
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 1,
      width: 100,
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 2,
      width: 200,
      editable: true,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      width: 80,
      key: 3,
      editable: true,
      render: (text: any, record: User) => (
        <p>{record.gender ? 'male' : 'female'}</p>
      ),
    },
    {
      title: 'Avatar',
      dataIndex: 'image',
      key: 4,
      width: 100,
      editable: true,
    },
    {
      title: 'Create Date',
      dataIndex: 'createAt',
      key: 5,
      width: 100,
      render: (text: any, record: User) => {
        const date = new Date(record.createdAt);
        return date.toDateString();
      },
    },
    {
      title: 'DOB',
      dataIndex: 'dateOfBirth',
      key: 6,
      width: 100,
      editable: true,
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 7,
      width: 74,
      render: (text: any, record: User) => (
        <span>
          {record.roles?.map((role) => {
            let color = role.name !== 'User' ? 'geekblue' : 'green';
            if (role.name === 'Admin') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={role.id}>
                {role.name?.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 8,
      fixed: rightFixed,
      width: 35,
      render: (text: any, record: User) => (
        <Popconfirm
          title='Update user status?'
          // onPopupClick={() => setSwtLoading(true)}
          onConfirm={() => handleUpdateStatus(record)}
        >
          <Switch
            key={record.id}
            // loading={swtLoading}
            // onClick={() => setSwtLoading(true)}
            // onChange={() => processUpdateStatus(record)}
            checked={record.status.toLowerCase() === 'active'}
          />
        </Popconfirm>
      ),
    },
    {
      title: 'Operation',
      dataIndex: 9,
      width: 100,
      key: 9,
      fixed: rightFixed,
      render: (text: any, record: User) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button type='primary' onClick={() => save(record)}>
              Save
            </Button>
            <Popconfirm
              placement='left'
              title='Cancel update?'
              onConfirm={cancel}
            >
              <Button>Cancel</Button>
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Button type='primary' ghost onClick={() => edit(record)}>
              Edit
            </Button>
            <Popconfirm
              placement='left'
              title='Delete this user?'
              onConfirm={() => handleDeleteUser(record.id)}
            >
              <Button type='primary' danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const editableColumns = userColsConfig.map((col) => {
    if (!col.editable) {
      return col;
    }

    if (col.dataIndex === 'gender') {
      return {
        ...col,
        render: (text: any, record: User) =>
          isEditing(record) ? (
            <Select
              defaultValue={[record.gender ? 'male' : 'female']}
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: true, label: 'male' },
                { value: false, label: 'female' },
              ]}
            />
          ) : (
            <p>{record.gender ? 'male' : 'female'}</p>
          ),
        onCell: (record: User) => ({
          record,
          inputType: 'boolean',
          dataIndex: 'gender',
          title: col.title,
          // editing: isEditing(record),
        }),
      };
    }
    return {
      ...col,
      onCell: (record: User) => ({
        record,
        inputType: col.dataIndex === 'gender' ? 'boolean' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const defaultExpandable = {
    expandedRowRender: (record: User) => (
      <span>
        {record.roles?.map((role) => {
          let color =
            role.name?.toLowerCase() !== 'user' ? 'geekblue' : 'green';
          if (role.name?.toLowerCase() === 'admin') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={role.id}>
              {role.name?.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  };

  interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: User;
    index: number;
    children: React.ReactNode;
  }

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const tableProps: TableProps<User> = {
    rowKey: (user) => user.id,
    bordered: true,
    loading: false,
    size: 'small',
    expandable: defaultExpandable,
    title: () => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1>User Management</h1>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          style={{ marginRight: 30 }}
          onClick={() => showModal()}
        >
          New User
        </Button>
      </div>
    ),
    showHeader: true,
    rowSelection: {},
    sticky: true,
    // // tableLayout: 'auto',
  };

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record: User) => record.id === editingKey;

  const edit = (record: Partial<User> & { id: React.Key }) => {
    // set default values when enter editable cell mode
    form.setFieldsValue({
      // fullName: '',  // default
      // email: '',
      // gender: '',
      image: '',
      ...record, // but ...record here overwrite the default values
    });
    setEditingKey(record.id);
  };

  const save = async (user: User) => {
    try {
      const row = (await form.validateFields()) as User;
      const gender = form.getFieldValue('gender');
      row.gender = gender;

      const newData = [...users];
      const index = newData.findIndex((item) => user.id === item.id);
      if (index > -1) {
        //update
        const usr = newData[index];
        newData.splice(index, 1, {
          ...usr,
          ...row,
        });
        row.id = user.id;
        await updateUser(row);
      } else {
        newData.push(row);
      }
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const cancel = () => {
    setEditingKey('');
  };

  const handleUpdateStatus = async (user: User) => {
    user.status =
      user.status.toLowerCase() === 'active' ? 'Inactive' : 'Active';
    const updatedUser = await callUpdateUser(user, token);
    if (updatedUser) {
      triggerSearchUser();
    }
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id);
  };

  async function updateUser(user: User) {
    if (user) {
      const userRes = await callUpdateUser(user, token);
      if (userRes) {
        triggerSearchUser();
      }
    }
  }

  async function deleteUser(id: string) {
    if (id) {
      const result = await callDeleteUser(id, token);
      console.log('result', result);
      if (result) {
        triggerSearchUser();
      } else {
        alert('Delete user fail');
      }
    }
  }

  useEffect(() => {
    triggerSearchUser();
    getRoleItems();
  }, []);

  const [createForm] = Form.useForm();
  const [loading, setLoading] = useState();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const [messageApi, msgContextHolder] = message.useMessage();
  const openMessage = (type: NoticeType, content?: string) => {
    messageApi.open({
      type: type,
      content: content ? content : '',
    });
  };
  const callCreate = async (user: User) => {
    if (user.username) {
      user.roles = pickedRoles;
      setUserToCreate(user);
    }
  };
  useEffect(() => {
    if (userToCreate.username) doCreateUser();
  }, [userToCreate]);
  // handle New User result
  useEffect(() => {
    if (!userToCreate.username) {
      return;
    }
    if (!createError && createResult?.data) {
      openMessage(
        'info',
        createResult?.data.username
          ? `New user created! username: ${createResult?.data.username}`
          : 'New user created!'
      );
      setOpen(false);
      createForm.resetFields();
      setPickedRoles([]);
      return;
    }
    if (createError?.response.data.message) {
      openMessage(
        'error',
        `Create user error: ${createError.response.data.message}`
      );
      // message.error(createError.response.data.message);
    } else {
      openMessage('error', `Error: Unknown`);
    }
  }, [createError, createResult]);
  const handleCancel = () => {
    setOpen(false);
    createForm.resetFields();
    setPickedRoles([]);
  };

  // add permission
  const [items, setItems] = useState<MenuProps['items']>([]);
  const [listRole, setListRole] = useState<Role[]>([]);

  async function getRoleItems() {
    try {
      const listRoles = await getAllRoles(token);
      setListRole(listRoles);
      const menu: MenuProps['items'] = [];
      const obj = listRoles.forEach((role, index) =>
        menu.push({
          key: role.id,
          label: role.name,
        })
      );
      setItems(menu);
    } catch (err) {
      console.error('Error fetching Roles:', err);
    }
  }

  const onClick: MenuProps['onClick'] = ({ key: id }) => {
    const newPicked = listRole.find((role) => role.id === id);
    if (newPicked && !pickedRoles.includes(newPicked)) {
      setPickedRoles([...pickedRoles, newPicked]);
    }
  };

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
    <div>
      {msgContextHolder}
      <Space wrap style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <Input
          placeholder='username'
          value={searchData}
          onChange={(e) => setSearchData(e.target.value)}
        />
        <Button type='primary' onClick={() => triggerSearchUser()}>
          Search
        </Button>
        <Button onClick={() => setSearchData('')}>Clear</Button>
      </Space>
      <Suspense fallback={<Spin tip='Loading...' />}>
        <Form form={form} component={false}>
          <Table
            {...tableProps}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            scroll={{ x: 2000, y: 500 }}
            loading={loadingUser}
            columns={editableColumns} // cause by type of 'fixed' prop of 'collums' type config
            dataSource={users}
            // rowClassName='editable-row'
            pagination={{
              onChange: cancel,
            }}
            summary={() => (
              <Table.Summary fixed='top'>
                {/* <Table.Summary.Row> */}
                <Table.Summary.Cell index={0} colSpan={3} />
                <Table.Summary.Cell index={3} colSpan={7} />
                <Table.Summary.Cell index={10} colSpan={2} />
                {/* </Table.Summary.Row> */}
              </Table.Summary>
            )}
          />
        </Form>
      </Suspense>
      <Modal
        open={open}
        width={700}
        style={{ justifyContent: 'center' }}
        title={<h2 style={{ textAlign: 'center' }}>New User</h2>}
        onCancel={handleCancel}
        footer={[]}
      >
        <Form
          name='basic'
          form={createForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          style={{
            maxWidth: 580,
            marginLeft: '2rem',
            marginRight: '2rem',
            marginTop: '2rem',
            width: '100%',
          }}
          initialValues={{ remember: true }}
          onFinish={callCreate}
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

          <Form.Item<User> label='Roles' name='roles'>
            <Space
              style={{
                flexWrap: 'wrap',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <span>
                {pickedRoles.map((per) => (
                  <Tag
                    closable
                    onClose={(e) => {
                      e.preventDefault();
                      handleClose(per.id);
                    }}
                  >
                    {per.name}
                  </Tag>
                ))}
              </span>
              <Dropdown
                // disabled
                overlayStyle={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  borderRadius: '0.5rem',
                  color: 'black',
                }}
                menu={{ items, onClick }}
                trigger={['click']}
              >
                <Button type='dashed'>
                  <Space>
                    Add role
                    {/* <DownOutlined /> */}
                  </Space>
                </Button>
              </Dropdown>
            </Space>
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
                type='link'
                style={{ marginRight: '13rem' }}
                onClick={() => createForm.resetFields()}
              >
                Reset form
              </Button>
              <Button key='back' onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                key='submit'
                type='primary'
                loading={loading}
                htmlType='submit'
              >
                Create
              </Button>
            </Space>
          </Form.Item>
          <Form.Item<User> name='password'>
            <input hidden value='default' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagementTable;
