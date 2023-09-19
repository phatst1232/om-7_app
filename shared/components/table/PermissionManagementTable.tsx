'use client';

import {
  callUpdatePermission,
  callDeletePermission,
  useSearchPermissionList,
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
} from 'antd'; // Import Switch from Ant Design
import { TableProps } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
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
  const router = useRouter();
  const {
    permissions,
    isMutating: loadingPermission,
    searchPermissionError,
    triggerSearchPermission,
  } = useSearchPermissionList(searchData, token);
  console.log('Permissions: ', permissions);
  const handleChange = (value: string[]) => {
    form.setFieldValue('gender', value);
  };

  type FixedType = 'left' | 'right' | boolean;
  const leftFixed: FixedType = 'left';
  const rightFixed: FixedType = 'right';

  const permissionColsConfig = [
    // {
    //   title: "Id",
    //   dataIndex: "id",
    //   key: "id",
    //   render: (text: any, record: PermissionData) => <p>{record.id?.slice(-12)}</p>,
    // },
    {
      title: 'Permission name',
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
      title: 'Status',
      dataIndex: 'status',
      key: 8,
      // fixed: rightFixed,
      width: 35,
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
      width: 100,
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
              <Button type='primary' danger>
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
          icon={<PlusCircleOutlined />}
          style={{ marginRight: 30 }}
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

  const handleDeletePermission = (id: string) => {
    deletePermission(id);
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
      }
    }
  }

  useEffect(() => {
    triggerSearchPermission();
  }, []);

  return (
    <div>
      <Space wrap style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <Input
          placeholder='permissionname'
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
            scroll={{ x: '100%', y: 500 }}
            // tableLayout='auto'
            columns={editableColumns} // cause by type of 'fixed' prop of 'collums' type config
            dataSource={permissions}
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

export default PermissionManagementTable;
