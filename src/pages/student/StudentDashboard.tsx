import { Card, Col, Row, Skeleton, Button, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ReadOutlined,
  MessageOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useGetMyRoadmapQuery } from "../../redux/api/features/roadmap/roadmapApi";
// import { useGetMyProgressQuery } from "../../redux/api/features/roadmap/progressApi";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { data: roadmapData, isLoading: loadingRoadmap } =
    useGetMyRoadmapQuery(undefined);
  // const { data: progressData, isLoading: loadingProgress } =
  //   useGetMyProgressQuery(undefined);

  const roadmap = roadmapData?.data;
  const progress = roadmap;

  const cards = [
    {
      icon: <ReadOutlined />,
      title: "Study plan",
      desc: roadmap ? roadmap.goal : "You haven't generated a roadmap yet",
      action: () => navigate("/student/roadmap"),
      cta: roadmap ? "View plan" : "Generate plan",
    },
    {
      icon: <MessageOutlined />,
      title: "Chat tutor",
      desc: "Ask a question about your current topic, any time",
      action: () => navigate("/student/chat"),
      cta: "Open chat",
    },
    {
      icon: <BarChartOutlined />,
      title: "Progress",
      desc: progress
        ? `${progress.overallPercent ?? 0}% complete, ${progress.dayStreak ?? 0} day streak`
        : "Track streaks and topic mastery",
      action: () => navigate("/student/progress"),
      cta: "View progress",
    },
  ];

  return (
    <div>
      <div className="eyebrow">Welcome back</div>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
        Your learning, at a glance
      </h2>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Pick up where you left off, or start something new.
      </p>

      {loadingRoadmap? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Row gutter={[16, 16]}>
          {cards.map((c) => (
            <Col xs={24} md={8} key={c.title}>
              <Card className="panel" style={{ height: "100%" }}>
                <div
                  style={{
                    fontSize: 20,
                    color: "var(--accent)",
                    marginBottom: 12,
                  }}
                >
                  {c.icon}
                </div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                  {c.title}
                </div>
                <div
                  style={{
                    color: "var(--muted)",
                    fontSize: 13.5,
                    marginBottom: 16,
                    minHeight: 40,
                  }}
                >
                  {c.desc}
                </div>
                <Button type="primary" onClick={c.action}>
                  {c.cta}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {!loadingRoadmap && !roadmap && (
        <Card className="panel" style={{ marginTop: 20 }}>
          <Empty description="No roadmap yet — tell us your goal to get started">
            <Button type="primary" onClick={() => navigate("/student/roadmap")}>
              Generate my roadmap
            </Button>
          </Empty>
        </Card>
      )}
    </div>
  );
}
