'use client';

import {
  callUpdatePermission,
  callDeletePermission,
  useSearchPermissionList,
  callCreatePermission,
} from '@/lib/action/permission-action';
import { Permission } from '@/lib/dto/dashboard-dtos';
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
  Checkbox,
} from 'antd'; // Import Switch from Ant Design
import { TableProps } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
function PermissionManagementTable() {
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
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const {
    permissions,
    isMutating: loadingPermission,
    searchPermissionError,
    triggerSearchPermission,
  } = useSearchPermissionList(searchData, token);
  console.log('Permissions: ', permissions);

  type FixedType = 'left' | 'right' | boolean;
  const leftFixed: FixedType = 'left';
  const rightFixed: FixedType = 'right';

  const permissionColsConfig = [
    {
      title: 'Permission name',
      dataIndex: 'name',
      key: 0,
      width: 200,
      // fixed: leftFixed,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 1,
      // width: 100,
      editable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 8,
      // fixed: rightFixed,
      width: 65,
      render: (text: any, record: Permission) => (
        <Popconfirm
          title='Update permission status?'
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
      width: 165,
      key: 9,
      // fixed: rightFixed,
      render: (text: any, record: Permission) => {
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
              title='Delete this permission?'
              onConfirm={() => handleDeletePermission(record.id)}
            >
              <Button type='primary' danger hidden={deleting}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const editableColumns = permissionColsConfig.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Permission) => ({
        record,
        inputType: col.dataIndex === 'status' ? 'boolean' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const defaultExpandable = {
    expandedRowRender: (record: Permission) => (
      <span>
        <p>{record.description}</p>
      </span>
    ),
  };

  interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Permission;
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

  const tableProps: TableProps<Permission> = {
    rowKey: (permission) => permission.id,
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
        <h1>Permission Management</h1>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          style={{ marginRight: 30 }}
          onClick={showModal}
        >
          New Permission
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
  const isEditing = (record: Permission) => record.id === editingKey;

  const edit = (record: Partial<Permission> & { id: React.Key }) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.id);
  };

  const save = async (permission: Permission) => {
    try {
      const row = (await form.validateFields()) as Permission;

      const newData = [...permissions];
      const index = newData.findIndex((item) => permission.id === item.id);
      if (index > -1) {
        //update
        const usr = newData[index];
        newData.splice(index, 1, {
          ...usr,
          ...row,
        });
        row.id = permission.id;
        await updatePermission(row);
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

  const handleUpdateStatus = async (permission: Permission) => {
    permission.status =
      permission.status.toLowerCase() === 'active' ? 'Inactive' : 'Active';
    const updatedPermission = await callUpdatePermission(permission, token);
    if (updatedPermission) {
      triggerSearchPermission();
    }
  };

  const handleDeletePermission = async (id: string) => {
    setDeleting(true);
    await deletePermission(id);
    setDeleting(false);
  };

  async function updatePermission(permission: Permission) {
    if (permission) {
      const permissionRes = await callUpdatePermission(permission, token);
      if (permissionRes) {
        triggerSearchPermission();
      }
    }
  }

  async function deletePermission(id: string) {
    if (id) {
      const result = await callDeletePermission(id, token);
      console.log('result', result);
      if (result) {
        triggerSearchPermission();
      } else {
        alert('Delete permission fail');
        triggerSearchPermission();
      }
    }
  }

  useEffect(() => {
    triggerSearchPermission();
  }, []);

  const [createForm] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  type FieldType = {
    permissionName?: string;
    description?: string;
    remember?: string;
  };

  const showModal = () => {
    setOpen(true);
  };

  const callCreate = async (values: any) => {
    setLoading(true);
    callCreatePermission(
      { name: values.permissionName, description: values.description },
      token
    );
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      createForm.resetFields();
      triggerSearchPermission();
    }, 3000);
  };
  const handleClickCreate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
    createForm.resetFields();
  };
  return (
    <div>
      <Space wrap style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <Input
          placeholder='Permission name'
          value={searchData}
          onChange={(e) => setSearchData(e.target.value)}
        />
        <Button type='primary' onClick={() => triggerSearchPermission()}>
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
            scroll={{ x: '100%', y: 'auto' }}
            loading={loadingPermission}
            columns={editableColumns} // cause by type of 'fixed' prop of 'collums' type config
            dataSource={permissions}
            // rowClassName='editable-row'
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
      </Suspense>

      <Modal
        open={open}
        title={<h2 style={{ textAlign: 'center' }}>New permission</h2>}
        onOk={handleClickCreate}
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
          <Form.Item<FieldType>
            label='Permission Name'
            name='permissionName'
            rules={[
              { required: true, message: 'Please input name of permission!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
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
        </Form>
      </Modal>
    </div>
  );
}

export default PermissionManagementTable;
