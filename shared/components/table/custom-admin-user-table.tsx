"use client";

import { getSearchUser, updateUserStatus } from "@/lib/action/user-action";
import { UserData } from "@/lib/dto/dashboard-dtos";
import { LOGIN_PATH } from "@/shared/common/app-route";
import {
  Input,
  Table,
  Switch,
  Button,
  Form,
  Popconfirm,
  Space,
  Tag,
} from "antd"; // Import Switch from Ant Design
import { ColumnsType, TableProps } from "antd/es/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function CustomAdminUserTable() {
  const [searchData, setSearchData] = useState("");
  // const [columns, setColumns] = useState<ColumnConfig[]>([]);
  const [dataSource, setDataSource] = useState<UserData[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(true);
  const [userToUpdate, setUserToUpdate] = useState<UserData>();
  const router = useRouter();

  const userColsConfig: ColumnsType<UserData> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (text: any, record: UserData) => <p>{record.id?.slice(-12)}</p>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      width: "5%",
      key: "gender",
      render: (text: any, record: UserData) => (
        <p>{record.gender ? "male" : "female"}</p>
      ),
    },
    {
      title: "Avatar",
      dataIndex: "image",
      key: "image",
      width: "5%",
    },
    {
      title: "Create Date",
      dataIndex: "createAt",
      key: "createAt",
      render: (text: any, record: UserData) => {
        const date = new Date(record.createdAt);
        return date.toDateString();
      },
    },
    {
      title: "DOB",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      width: "5%",
      render: (text: any, record: UserData) => (
        <span>
          {record.roles?.map((role) => {
            let color = role !== "User" ? "geekblue" : "green";
            if (role === "Admin") {
              color = "volcano";
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: any, record: UserData) => (
        // <Popconfirm title="Update user status?" onConfirm={() => processUpdateStatus(record)}>
        // </Popconfirm>
        <Switch
          onClick={() => processUpdateStatus(record)}
          // onChange={() => processUpdateStatus(record)}
          checked={record.status.toLowerCase() === "active"}
        />
      ),
    },
    {
      title: "Operation",
      render: (text: any, record: UserData) => (
        <Space>
          <Button type="primary" onClick={() => edit}>
            Edit
          </Button>
          <Popconfirm
            placement="left"
            title="Delete this user?"
            onConfirm={() => processUpdateStatus(record)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const defaultExpandable = {
    expandedRowRender: (record: UserData) => (
      <span>
        {record.roles?.map((role) => {
          let color = role !== "User" ? "geekblue" : "green";
          if (role === "Admin") {
            color = "volcano";
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
  const tableProps: TableProps<UserData> = {
    bordered: true,
    loading: tableLoading,
    size: "small",
    expandable: defaultExpandable,
    title: () => <h1>User Management</h1>,
    showHeader: true,
    // footer: () => 'Here is footer',
    rowSelection: {},
    scroll: { x: "100vw", y: 300 },
    tableLayout: "auto",
  };

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [data, setData] = useState(dataSource);

  const edit = (record: Partial<UserData> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const processUpdateStatus = (record: UserData) => {
    // setTriggerSearch(!triggerSearch);
    record.status =
      record.status.toLowerCase() === "active" ? "Inactive" : "Active";
    setUserToUpdate(record);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(LOGIN_PATH);
      return;
    }

    async function updateStatus(token: string) {
      // setTableLoading(true);
      if (userToUpdate) {
        const user = await updateUserStatus(userToUpdate, token);
        if (user) {
          fetchData(token);
        }
      }
    }
    updateStatus(token);
    // setTableLoading(false)
  }, [userToUpdate]);

  async function fetchData(token: string) {
    // setTableLoading(true);
    const users = await getSearchUser(token, searchData);
    // if (users.length === 0) {
    //   // alert('No users found!');
    //   setDataSource([]);
    //   setTableLoading(false);
    //   return;
    // } else {
    //   const firstUser = users[0];

    //   if (firstUser) {
    //     const cols = Object.keys(firstUser).map(key => {
    //       const column: ColumnConfig = {
    //         title: key,
    //         dataIndex: key,

    //       };

    //       switch (key) {
    //         case 'status':
    //           column.render = (text: any, record: UserData) => (
    //             <Switch checked={text === "active"} disabled />
    //           );
    //         case 'gender':
    //           column.render = (text: any, record: UserData) => (
    //             <p>{record.gender? 'male': 'female'}</p>
    //           );
    //         default:

    //       }
    //       return column;
    //     });
    //     cols.push({
    //       title: "action",
    //       key: "action",
    //       // sorter: true,
    //       render: (_: any, record: UserData) => {
    //         const editable = isEditing(record);
    //         return (
    //           <div>
    //             <Space>
    //               {editable ? (
    //                 <span>
    //                   <a
    //                     onClick={() => save(record.id)}
    //                     style={{ marginRight: 8 }}
    //                   >
    //                     Save
    //                   </a>
    //                   <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
    //                     <a>Cancel</a>
    //                   </Popconfirm>
    //                 </span>
    //               ) : (
    //                 <a
    //                   // disabled={false}
    //                   onClick={() => edit(record)}
    //                 >
    //                   Edit
    //                 </a>
    //               )}
    //               <a style={{ color: "red" }}>
    //                 Delete
    //               </a>
    //             </Space>
    //           </div>
    //         );
    //       },
    //     });
    //     setColumns(cols);
    //   }
    // }
    setDataSource(users);
    // setTableLoading(false);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(LOGIN_PATH);
      return;
    }

    fetchData(token);
  }, [triggerSearch, userToUpdate]);

  return (
    <div>
      <Space wrap>
        <Input
          placeholder="username"
          value={searchData}
          onChange={(e) => setSearchData(e.target.value)}
        />
        <Button type="primary" onClick={() => setTriggerSearch(!triggerSearch)}>
          Search
        </Button>
        <Button onClick={() => setSearchData("")}>Clear</Button>
      </Space>
      <Table
        {...tableProps}
        columns={userColsConfig}
        dataSource={dataSource}
        rowClassName={() => "editable-row"}
      />
    </div>
  );
}

export default CustomAdminUserTable;
