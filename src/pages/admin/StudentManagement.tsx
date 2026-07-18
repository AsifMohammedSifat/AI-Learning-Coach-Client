import { useState } from "react";
import { Table, Input, Tag, Button, Popconfirm, Avatar, Select } from "antd";
import {
  UserOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import {
  useDeleteStudentMutation,
  useListStudentsQuery,
  useUpdateStudentStatusMutation,
} from "../../redux/api/features/admin/adminApi";

interface Student {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: "student";
  status: "in-progress" | "blocked";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const STATUS_FILTERS = [
  { label: "All statuses", value: "all" },
  { label: "In progress", value: "in-progress" },
  { label: "Blocked", value: "blocked" },
];

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isFetching } = useListStudentsQuery({
    page,
    limit: pageSize,
    searchTerm: searchTerm || undefined,
  });

  const [updateStatus] = useUpdateStudentStatusMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  const students: any = data?.data ?? [];
  const filteredStudents =
    status === "all"
      ? students
      : students.filter((s: any) => s.status === status);

  const handleToggleStatus = async (record: Student) => {
    const nextStatus = record.status === "blocked" ? "in-progress" : "blocked";
    try {
      await updateStatus({ id: record._id, status: nextStatus }).unwrap();
      toast.success(
        `${record.name} is now ${nextStatus === "blocked" ? "blocked" : "in progress"}`,
      );
    } catch (err: any) {
      // handled globally
      toast.error(err?.data?.message, {
        position: "top-center",
      });
    }
  };

  const handleDelete = async (record: Student) => {
    try {
      await deleteStudent(record._id).unwrap();
      toast.success(`${record.name} removed`);
    } catch (err: any) {
      // handled globally
      toast.error(err?.data?.message, {
        position: "top-center",
      });
    }
  };

  const columns = [
    {
      title: "Student",
      dataIndex: "name",
      render: (_: any, record: Student) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar src={record.avatar} icon={<UserOutlined />} size={32} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{record.name}</div>
            <div
              className="mono"
              style={{ fontSize: 11.5, color: "var(--muted)" }}
            >
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      render: (v: string) => (v ? new Date(v).toLocaleDateString() : "—"),
      sorter: (a: Student, b: Student) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (v: Student["status"]) => (
        <Tag color={v === "blocked" ? "red" : "gold"}>
          {v === "blocked" ? "BLOCKED" : "IN PROGRESS"}
        </Tag>
      ),
      filters: [
        { text: "In progress", value: "in-progress" },
        { text: "Blocked", value: "blocked" },
      ],
      onFilter: (value: any, record: Student) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Student) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            size="small"
            danger={record.status !== "blocked"}
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === "blocked" ? "Unblock" : "Block"}
          </Button>
          <Popconfirm
            title="Remove this student?"
            description="This can't be undone."
            okText="Remove"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="eyebrow">Student management</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
        All students
      </h2>
      <p style={{ color: "var(--muted)", marginBottom: 20 }}>
        Search, filter, and manage every student account.
      </p>

      <div
        style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}
      >
        <Input
          placeholder="Search by name or email"
          prefix={<SearchOutlined style={{ color: "var(--muted)" }} />}
          style={{ maxWidth: 320 }}
          value={searchTerm}
          onChange={(e) => {
            setPage(1);
            setSearchTerm(e.target.value);
          }}
          allowClear
        />
        <Select
          value={status}
          style={{ width: 160 }}
          onChange={(v) => {
            setPage(1);
            setStatus(v);
          }}
          options={STATUS_FILTERS}
        />
      </div>

      <div className="panel">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredStudents}
          loading={isLoading || isFetching}
          pagination={{
            current: page,
            pageSize,
            total: Number(data?.total ?? 0),
            onChange: setPage,
          }}
        />
      </div>
    </div>
  );
}
