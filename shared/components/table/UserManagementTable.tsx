'use client';
import {
  callUpdateUser,
  callDeleteUser,
  useSearchUserList,
} from '@/lib/action/user-action';
import { User } from '@/lib/dto/dashboard-dtos';
import { GET_ALL_USER_ROUTE } from '@/shared/common/api-route';
import { LOGIN_PATH } from '@/shared/common/app-route';
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
  SelectProps,
  Spin,
} from 'antd'; // Import Switch from Ant Design
import { ColumnsType, TableProps } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import useSWR from 'swr';

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
  const router = useRouter();
  const {
    users,
    isMutating: loadingUser,
    searchUserError,
    triggerSearchUser,
  } = useSearchUserList(searchData, token);
  console.log('Users: ', users);
  const handleChange = (value: string[]) => {
    form.setFieldValue('gender', value);
  };

  type FixedType = 'left' | 'right' | boolean;
  const leftFixed: FixedType = 'left';
  const rightFixed: FixedType = 'right';

  const userColsConfig = [
    // {
    //   title: "Id",
    //   dataIndex: "id",
    //   key: "id",
    //   render: (text: any, record: UserData) => <p>{record.id?.slice(-12)}</p>,
    // },
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
            let color = role !== 'User' ? 'geekblue' : 'green';
            if (role === 'Admin') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={role}>
                {role.toUpperCase()}
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
          let color = role !== 'User' ? 'geekblue' : 'green';
          if (role === 'Admin') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={role}>
              {role.toUpperCase()}
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
    title: () => <h1>User Management</h1>,
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
      // image: '',
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
  }, []);

  return (
    <div>
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
            // tableLayout='auto'
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
    </div>
  );
}

export default UserManagementTable;
