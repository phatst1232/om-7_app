'use client';

import {
  callUpdateRole,
  callDeleteRole,
  useSearchRoleList,
  getAllPermissions,
  useCreateRole,
} from '@/lib/action/role-action';
import { CreateRoleDto, Permission, Role } from '@/lib/dto/dashboard-dtos';
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
  Modal,
  Dropdown,
  MenuProps,
  message,
} from 'antd'; // Import Switch from Ant Design
import { TableProps } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { NoticeType } from 'antd/es/message/interface';

type permissionTag = {
  index: number;
  label: string;
  id: string;
  permissionName: string;
  description?: string;
};

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
            let color = permission.name !== 'User' ? 'geekblue' : 'green';
            if (permission.name === 'Admin') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={permission.name}>
                {typeof permission.name === 'string'
                  ? permission.name.toUpperCase()
                  : permission.name}
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
          let color = permission.name !== 'User' ? 'geekblue' : 'green';
          if (permission.name === 'Admin') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={permission.name}>
              {typeof permission.name === 'string'
                ? permission.name.toUpperCase()
                : permission.name}
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
          icon={<PlusOutlined />}
          style={{ marginRight: 30 }}
          onClick={() => showModal()}
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
      if (!result) {
        alert('Delete role fail');
      }
      triggerSearchRole();
    }
  }

  useEffect(() => {
    triggerSearchRole();
    getPmsItems();
  }, []);
  const [createForm] = Form.useForm();
  const [loading, setLoading] = useState();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  type PermissionFields = {
    roleName?: string;
    description?: string;
    permissions: Permission[];
  };
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const [roleToCreate, setRoleToCreate] = useState<CreateRoleDto>(
    {} as CreateRoleDto
  );

  const { createResult, createError, creatingRole, doCreateRole } =
    useCreateRole(roleToCreate, token);

  const [messageApi, msgContextHolder] = message.useMessage();
  const openMessage = (type: NoticeType, content?: string) => {
    messageApi.open({
      type: type,
      content: content ? content : '',
    });
  };

  const callCreate = async (role: CreateRoleDto) => {
    if (role.name) {
      role.permissions = pickedPms;
      setRoleToCreate(role);
    }
  };

  useEffect(() => {
    if (roleToCreate.name) doCreateRole();
  }, [roleToCreate]);
  // handle New User result
  useEffect(() => {
    if (!roleToCreate.name) {
      return;
    }
    if (!createError && createResult?.data) {
      openMessage(
        'info',
        createResult?.data.name
          ? `New role created! name: ${createResult?.data.name}`
          : 'New user created!'
      );
      setOpen(false);
      createForm.resetFields();
      setPickedPms([]);
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
    setPickedPms([]);
  };

  // add permission
  const [items, setItems] = useState<MenuProps['items']>([]);
  const [listPermission, setListPermission] = useState<Permission[]>([]);
  async function getPmsItems() {
    try {
      const listPers = await getAllPermissions(token);
      setListPermission(listPers);
      const menu: MenuProps['items'] = [];
      const obj = listPers.forEach((per, index) =>
        menu.push({
          key: per.id,
          label: per.name,
        })
      );
      setItems(menu);
    } catch (err) {
      console.error('Error fetching permissions:', err);
    }
  }
  const onClick: MenuProps['onClick'] = ({ key: id }) => {
    // message.info(`Click on item ${id}`);
    const newPicked = listPermission.find((per) => per.id === id);
    if (newPicked && !pickedPms.includes(newPicked)) {
      setPickedPms([...pickedPms, newPicked]);
    }
  };

  const [pickedPms, setPickedPms] = useState<Permission[]>([]);

  const handleClose = (perId: string) => {
    const newTags = pickedPms.filter((per) => per.id !== perId);
    console.log(newTags);
    setPickedPms(newTags);
  };

  return (
    <div>
      <Space wrap style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <Input
          placeholder='Role name'
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
            loading={loadingRole}
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
      <Modal
        open={open}
        title={<h2 style={{ textAlign: 'center' }}>New Role</h2>}
        // onOk={handleClickCreate}
        onCancel={handleCancel}
        footer={[]}
      >
        <Form
          name='basic'
          form={createForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, marginTop: '2rem' }}
          initialValues={{ remember: true }}
          onFinish={callCreate}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item<PermissionFields>
            label='Role Name'
            name='roleName'
            rules={[
              { required: true, message: 'Please input name of permission!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<PermissionFields> label='Permissions' name='permissions'>
            <Space style={{ flexWrap: 'wrap' }}>
              {pickedPms.map((per) => (
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
            </Space>
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
                  Add permission
                  {/* <DownOutlined /> */}
                </Space>
              </Button>
            </Dropdown>
          </Form.Item>

          <Form.Item<PermissionFields>
            label='Description'
            name='description'
            // rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Space style={{ display: 'flex', justifyContent: 'center' }}>
              <Button key='back' onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                key='submit'
                type='primary'
                loading={loading}
                // onClick={handleCreate}
                htmlType='submit'
              >
                Create
              </Button>
            </Space>
          </Form.Item>
          <Form.Item>
            <Space>{}</Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default RoleManagementTable;
