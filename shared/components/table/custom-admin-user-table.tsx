'use client';

import {
  getSearchUser,
  callUpdateUser,
  callDeleteUser,
} from '@/lib/action/user-action';
import { User } from '@/lib/dto/dashboard-dtos';
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
} from 'antd'; // Import Switch from Ant Design
import { ColumnsType, TableProps } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GenderChooseButton from '../button/gender-choose-btn';

function CustomAdminUserTable() {
  const [searchData, setSearchData] = useState('');
  // const [columns, setColumns] = useState<ColumnConfig[]>([]);
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [swtLoading, setSwtLoading] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(true);
  const [userToUpdate, setUserToUpdate] = useState<User>();
  const [userToDelete, setUserToDelete] = useState<User>();

  const router = useRouter();

  const options: SelectProps['options'] = [];
  const handleChange = (value: string[]) => {
    form.setFieldValue('gender', value);
  };

  // antd's datatype copy || avoid columns type error
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
      width: '10%',
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
        // <Popconfirm title="Update user status?" onConfirm={() => processUpdateStatus(record)}>
        // </Popconfirm>
        <Switch
          key={record.id}
          loading={swtLoading}
          onClick={() => handleUpdateStatus(record)}
          // onChange={() => processUpdateStatus(record)}
          checked={record.status.toLowerCase() === 'active'}
        />
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
              onConfirm={() => handleDeleteUser(record)}
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
    // rowExpandable: (record: User) => // conditions of expandable rows',
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
    loading: tableLoading,
    size: 'small',
    expandable: defaultExpandable,
    title: () => <h1>User Management</h1>,
    showHeader: true,
    rowSelection: {},
    sticky: true,
    // scroll: { x: 300, y: 300 },
    // // tableLayout: 'auto',
  };

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record: User) => record.id === editingKey;
  // const [data, setData] = useState(dataSource);

  const edit = (record: Partial<User> & { id: React.Key }) => {
    form.setFieldsValue({
      fullName: '',
      email: '',
      // gender: '',
      image: '',
      ...record,
    });
    setEditingKey(record.id);
  };

  const save = async (user: User) => {
    try {
      const row = (await form.validateFields()) as User;
      const gender = form.getFieldValue('gender');
      row.gender = gender;

      const newData = [...dataSource];
      const index = newData.findIndex((item) => user.id === item.id);
      if (index > -1) {
        //update
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        row.id = user.id;
        setUserToUpdate(row);
      } else {
        //add
        newData.push(row);
        // setData(newData);
      }

      // setUserToUpdate(user);
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const cancel = () => {
    setEditingKey('');
  };

  const handleUpdateStatus = (record: User) => {
    // setTriggerSearch(!triggerSearch);
    record.status =
      record.status.toLowerCase() === 'active' ? 'Inactive' : 'Active';
    setUserToUpdate(record);
  };

  const handleDeleteUser = (user: User) => {
    // setUserToDelete(user);
    deleteUser(user);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push(LOGIN_PATH);
      return;
    }

    async function updateUser(token: string) {
      if (userToUpdate) {
        const user = await callUpdateUser(userToUpdate, token);
        if (user) {
          fetchData(token);
        }
      }
    }
    updateUser(token);
  }, [userToUpdate]);

  async function fetchData(token: string) {
    const users = await getSearchUser(token, searchData);
    setDataSource(users);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push(LOGIN_PATH);
      return;
    }

    fetchData(token);
  }, [triggerSearch]);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     router.push(LOGIN_PATH);
  //     return;
  //   }

  //   async function deleteUser(token: string) {
  //     // setSwtLoading(true);
  //     if (userToUpdate) {
  //       const result = await callDeleteUser(userToUpdate, token);
  //       if (result) {
  //         fetchData(token);
  //       } else {
  //         alert('Delete user fail');
  //       }
  //     }
  //     // setSwtLoading(false);
  //   }
  //   deleteUser(token);
  // }, [userToDelete]);

  const token = localStorage.getItem('token') || '';

  async function deleteUser(user: User) {
    if (user) {
      const result = await callDeleteUser(user, token);
      console.log('result', result);
      if (result) {
        fetchData(token);
      } else {
        alert('Delete user fail');
      }
    }
  }

  return (
    <div>
      <Space wrap style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <Input
          placeholder='username'
          value={searchData}
          onChange={(e) => setSearchData(e.target.value)}
        />
        <Button type='primary' onClick={() => setTriggerSearch(!triggerSearch)}>
          Search
        </Button>
        <Button onClick={() => setSearchData('')}>Clear</Button>
      </Space>
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
          dataSource={dataSource}
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
    </div>
  );
}

export default CustomAdminUserTable;
