import { useNavigate } from "react-router-dom";
import { Skeleton, Empty, Button, Tag, Card } from "antd";
import "./Student.css";
import { useGetMyRoadmapQuery } from "../../redux/api/features/roadmap/roadmapApi";

interface RoadmapSummary {
  _id: string;
  goal: string;
  language: string;
  currentLevel: string;
  hoursPerDay: number;
  roadMapStatus: "active" | "archived" | "completed";
  weeks: { status: string }[];
  createdAt: string;
}

export default function MyRoadmapsList() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetMyRoadmapQuery(undefined);
  const roadmaps: RoadmapSummary[] = data?.data ?? [];
  // console.log(roadmaps)

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  if (isError) {
    return (
      <Empty description="Couldn't load your roadmaps">
        <Button onClick={() => refetch()}>রিফ্রেশ করো</Button>
      </Empty>
    );
  }

  if (!roadmaps.length) {
    return (
      <Empty description="You haven't generated any roadmap yet">
        <Button
          type="primary"
          onClick={() => navigate("/student/roadmap/generate")}
        >
          Generate your first roadmap
        </Button>
      </Empty>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="eyebrow">My roadmaps</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
        Your generated roadmaps
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {roadmaps.map((rm) => {
          const totalWeeks = rm.weeks?.length ?? 0;
          const completedWeeks =
            rm.weeks?.filter((w) => w.status === "done").length ?? 0;

          return (
            <Card key={rm._id} className="panel" style={{ padding: 4 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{rm.goal}</div>
                  <div
                    className="mono"
                    style={{
                      color: "var(--muted)",
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    {rm.language} · {rm.currentLevel} · {rm.hoursPerDay}h/day ·{" "}
                    {new Date(rm.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Tag
                    color={rm.roadMapStatus === "active" ? "green" : "default"}
                  >
                    {rm.roadMapStatus.toUpperCase()}
                  </Tag>
                  <Tag>
                    {completedWeeks}/{totalWeeks} weeks
                  </Tag>
                  <Button
                    type="primary"
                    onClick={() => navigate(`/student/roadmap/me/${rm._id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
