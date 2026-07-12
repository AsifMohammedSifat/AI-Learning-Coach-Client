import { useState } from "react";
import { Table, Input, Tag, Button, Popconfirm, Avatar, Select } from "antd";
import { UserOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { useDeleteStudentMutation, useListStudentsQuery, useUpdateStudentStatusMutation } from "../../redux/api/features/profile/profileApi";


export default function StudentManagement() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isFetching } = useListStudentsQuery({
    search,
    status: status === "all" ? undefined : status,
    page,
    limit: pageSize,
  });

  const [updateStatus] = useUpdateStudentStatusMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  const handleToggleStatus = async (record:any) => {
    const nextStatus = record.status === "active" ? "suspended" : "active";
    try {
      await updateStatus({ id: record._id, status: nextStatus }).unwrap();
      toast.success(`${record.name} is now ${nextStatus}`);
    } catch {
      // handled globally
    }
  };

  const handleDelete = async (record:any) => {
    try {
      await deleteStudent(record._id).unwrap();
      toast.success(`${record.name} removed`);
    } catch {
      // handled globally
    }
  };

  const columns = [
    {
      title: "Student",
      dataIndex: "name",
      render: (_:any, record:any) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar src={record.avatar} icon={<UserOutlined />} size={32} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{record.name}</div>
            <div className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Roadmap progress",
      dataIndex: "progressPercent",
      render: (v:any) => (v != null ? `${v}%` : "—"),
      sorter: (a:any, b:any) => (a.progressPercent ?? 0) - (b.progressPercent ?? 0),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      render: (v:any) => (v ? new Date(v).toLocaleDateString() : "—"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (v:any) => (
        <Tag color={v === "active" ? "green" : "red"}>{(v || "active").toUpperCase()}</Tag>
      ),
      filters: [
        { text: "Active", value: "active" },
        { text: "Suspended", value: "suspended" },
      ],
      onFilter: (value:any, record:any) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_:any, record:any) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button size="small" onClick={() => handleToggleStatus(record)}>
            {record.status === "active" ? "Suspend" : "Activate"}
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
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>All students</h2>
      <p style={{ color: "var(--muted)", marginBottom: 20 }}>
        Search, filter, and manage every student account.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <Input
          placeholder="Search by name or email"
          prefix={<SearchOutlined style={{ color: "var(--muted)" }} />}
          style={{ maxWidth: 320 }}
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
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
          options={[
            { label: "All statuses", value: "all" },
            { label: "Active", value: "active" },
            { label: "Suspended", value: "suspended" },
          ]}
        />
      </div>

      <div className="panel">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data?.data || []}
          loading={isLoading || isFetching}
          pagination={{
            current: page,
            pageSize,
            total: data?.total || 0,
            onChange: setPage,
          }}
        />
      </div>
    </div>
  );
}
