import { Card, Col, Row, Skeleton } from "antd";
import {
  TeamOutlined,
  ReadOutlined,
  MessageOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useListStudentsQuery } from "../../redux/api/features/profile/profileApi";

export default function AdminDashboard() {
  const { data, isLoading } = useListStudentsQuery({ page: 1, limit: 5 });


  const summary = data?.summary;
  const students = data?.data ?? [];

  const cards = [
    {
      icon: <TeamOutlined />,
      label: "Total students",
      value: summary?.totalStudents ?? "—",
    },
    {
      icon: <ReadOutlined />,
      label: "Active roadmaps",
      value: summary?.activeRoadmaps ?? "—",
    },
    {
      icon: <MessageOutlined />,
      label: "Chat messages today",
      value: summary?.chatMessagesToday ?? "—",
    },
    {
      icon: <RiseOutlined />,
      label: "Avg. completion",
      value: summary?.avgCompletion !== undefined ? `${summary.avgCompletion}%` : "—",
    },
  ];

  return (
    <div>
      <div className="eyebrow">Admin overview</div>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
        Platform at a glance
      </h2>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Monitor students, roadmaps, and engagement in one place.
      </p>

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Row gutter={[16, 16]}>
          {cards.map((c) => (
            <Col xs={24} sm={12} md={6} key={c.label}>
              <Card className="panel">
                <div style={{ fontSize: 20, color: "var(--accent)", marginBottom: 12 }}>
                  {c.icon}
                </div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{c.value}</div>
                <div style={{ color: "var(--muted)", fontSize: 12.5, marginTop: 4 }}>
                  {c.label}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Card className="panel" style={{ marginTop: 20 }} title="Recently joined students">
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <div>
            {/* ✅ no `.slice(0, 5)` needed — backend already returns exactly
                `limit` (5) students, since we requested { page: 1, limit: 5 } */}
            {students.map((s) => (
              <div
                key={s._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 13.5,
                }}
              >
                <span>{s.name}</span>
                <span style={{ color: "var(--muted)" }} className="mono">
                  {s.email}
                </span>
              </div>
            ))}
            {students.length === 0 && (
              <div style={{ color: "var(--muted)", fontSize: 13.5 }}>
                No students yet.
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}