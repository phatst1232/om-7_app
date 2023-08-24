import React, { useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';

interface UserData {
  id: string;
  fullName?: string;
  username?: string;
  phone?: string;
  gender?: boolean;
  // image: string;
  dateOfBirth?: string;
  createdAt?: string;
  roles?: string[];
  status: string;
}

function getCurrentFormattedDate(): string {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
  const year = currentDate.getFullYear();

  return `${day}-${month}-${year}`;
}

const originData: UserData[] = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    id: i.toString(), 
    fullName: `Edward ${i}`,
    username: `Username ${i}`,
    phone: `0921241233${i}`,
    gender: (Date.now()%2 === 0) ? true : false ,
    // image: 'none',
    dateOfBirth: getCurrentFormattedDate(),
    createdAt: getCurrentFormattedDate(),
    roles: ['admin', 'user'],
    status: ''
  });
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: UserData;
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

const TableAdminUser: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");

  const [dataSource, setDataSource] = useState<UserData[]>(originData)

  const isEditing = (record: UserData) => record.id === editingKey;

  const edit = (record: Partial<UserData> & { id: React.Key }) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as UserData;

      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "User Id",
      dataIndex: "id",
      width: "8%",
      editable: true,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      width: "11%",
      editable: true,
    },
    {
      title: "Username",
      dataIndex: "username",
      width: "11%",
      editable: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      width: "15%",
      editable: true,
    },
    {
      title: "gender",
      dataIndex: "gender",
      // width: '40%',
      editable: true,
    },
    // {
    //   title: 'Avatar',
    //   dataIndex: 'image',
    //   // width: '40%',
    //   editable: true,
    // },
    {
      title: "DOB",
      dataIndex: "dateOfBirth",
      width: "17%",
      editable: true,
    },
    {
      title: "Create Date",
      dataIndex: "createdAt",
      width: "17%",
      editable: true,
    },
    {
      title: "Roles",
      dataIndex: "roles",
      // width: '40%',
      editable: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      // width: '40%',
      editable: true,
    },
    // Operation
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: UserData) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  // add record
  const [count, setCount] = useState(originData.length);
  const handleAdd = () => {
    const newData: UserData = {
      id: `${count}`,
      status: 'active'
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: UserData) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
    </div>
    
  );
};

export default TableAdminUser;