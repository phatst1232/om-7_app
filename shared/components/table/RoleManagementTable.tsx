'use client';

import {
  callUpdateRole,
  callDeleteRole,
  useSearchRoleList,
} from '@/lib/action/role-action';
import { Role } from '@/lib/dto/dashboard-dtos';
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
} from 'antd'; // Import Switch from Ant Design
import { TableProps } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
function RoleManagementTable() {
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
    roles,
    isMutating: loadingRole,
    searchRoleError,
    triggerSearchRole,
  } = useSearchRoleList(searchData, token);
  console.log('Roles: ', roles);
  const handleChange = (value: string[]) => {
    form.setFieldValue('gender', value);
  };

  type FixedType = 'left' | 'right' | boolean;
  const leftFixed: FixedType = 'left';
  const rightFixed: FixedType = 'right';

  const roleColsConfig = [
    // {
    //   title: "Id",
    //   dataIndex: "id",
    //   key: "id",
    //   render: (text: any, record: RoleData) => <p>{record.id?.slice(-12)}</p>,
    // },
    {
      title: 'Role name',
      dataIndex: 'name',
      key: 0,
      width: 30,
      // fixed: leftFixed,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 1,
      width: 100,
      editable: true,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 7,
      width: 74,
      render: (text: any, record: Role) => (
        <span>
          {record.permissions?.map((permission) => {
            let color = permission !== 'Role' ? 'geekblue' : 'green';
            if (permission === 'Admin') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={permission}>
                {permission.toUpperCase()}
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
      // fixed: rightFixed,
      width: 35,
      render: (text: any, record: Role) => (
        <Popconfirm
          title='Update role status?'
          onConfirm={() => handleUpdateStatus(record)}
        >
          <Switch
            key={record.id}
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
      // fixed: rightFixed,
      render: (text: any, record: Role) => {
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
              title='Delete this role?'
              onConfirm={() => handleDeleteRole(record.id)}
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

  const editableColumns = roleColsConfig.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Role) => ({
        record,
        inputType: col.dataIndex === 'status' ? 'boolean' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const defaultExpandable = {
    expandedRowRender: (record: Role) => (
      <span>
        {record.permissions?.map((permission) => {
          let color = permission !== 'Role' ? 'geekblue' : 'green';
          if (permission === 'Admin') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={permission}>
              {permission.toUpperCase()}
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
    record: Role;
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

  const tableProps: TableProps<Role> = {
    rowKey: (role) => role.id,
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
        <h1>Role Management</h1>
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          style={{ marginRight: 30 }}
        >
          New Role
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
  const isEditing = (record: Role) => record.id === editingKey;

  const edit = (record: Partial<Role> & { id: React.Key }) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.id);
  };

  const save = async (role: Role) => {
    try {
      const row = (await form.validateFields()) as Role;

      const newData = [...roles];
      const index = newData.findIndex((item) => role.id === item.id);
      if (index > -1) {
        //update
        const usr = newData[index];
        newData.splice(index, 1, {
          ...usr,
          ...row,
        });
        row.id = role.id;
        await updateRole(row);
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

  const handleUpdateStatus = async (role: Role) => {
    role.status =
      role.status.toLowerCase() === 'active' ? 'Inactive' : 'Active';
    const updatedRole = await callUpdateRole(role, token);
    if (updatedRole) {
      triggerSearchRole();
    }
  };

  const handleDeleteRole = (id: string) => {
    deleteRole(id);
  };

  async function updateRole(role: Role) {
    if (role) {
      const roleRes = await callUpdateRole(role, token);
      if (roleRes) {
        triggerSearchRole();
      }
    }
  }

  async function deleteRole(id: string) {
    if (id) {
      const result = await callDeleteRole(id, token);
      console.log('result', result);
      if (result) {
        triggerSearchRole();
      } else {
        alert('Delete role fail');
      }
    }
  }

  useEffect(() => {
    triggerSearchRole();
  }, []);

  return (
    <div>
      <Space wrap style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <Input
          placeholder='rolename'
          value={searchData}
          onChange={(e) => setSearchData(e.target.value)}
        />
        <Button type='primary' onClick={() => triggerSearchRole()}>
          Search
        </Button>
        <Button onClick={() => setSearchData('')}>Clear</Button>
      </Space>
      <Suspense fallback={<p>Loading...</p>}>
        <Form form={form} component={false}>
          <Table
            {...tableProps}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            scroll={{ x: '100%', y: 500 }}
            // tableLayout='auto'
            columns={editableColumns} // cause by type of 'fixed' prop of 'collums' type config
            dataSource={roles}
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

export default RoleManagementTable;
