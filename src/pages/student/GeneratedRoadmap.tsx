import { useState } from "react";
import { Skeleton, Empty, Button } from "antd";

import "./Student.css";
import "../auth/Auth.css";
import { useUpdateProgressMutation } from "../../redux/api/features/roadmap/progressApi";
import { useGetMyRoadmapQuery } from "../../redux/api/features/roadmap/roadmapApi";
import { dummyRoadmap } from "../../mocks/roadmap";
import { useParams } from "react-router-dom";
import { useGetRoadmapByIdQuery } from "../../redux/api/features/roadmap/roadmapApi";

type WeekStatus = "done" | "current" | "upcoming" | "locked";

interface Topic {
  id: string;
  text: string;
  done: boolean;
}

interface Week {
  id: string;
  order: number;
  title: string;
  status: WeekStatus;
  topics?: Topic[];
  estimatedHoursLeft?: number; // shown for the "current" week's time badge
  resource?: string; // optional suggested resource line
}

export interface RoadmapData {
  goal: string;
  language: string;
  hoursPerDay: number;
  currentLevel: string;
  weeks: Week[];
}

export default function GeneratedRoadMap() {
  // const { data, isLoading, isError, refetch } = useGetMyRoadmapQuery(undefined);

  const [updateProgress] = useUpdateProgressMutation();

  const { roadmapId } = useParams();

  const { data, isLoading, isError, refetch } = useGetRoadmapByIdQuery(
    roadmapId!,
    {
      skip: !roadmapId,
    },
  );

  console.log("data", data);
  const roadmap: RoadmapData | undefined = data?.data;
  // const roadmap: RoadmapData | undefined = dummyRoadmap; // TODO: revert to data?.data before commit

  // which week card is expanded — default to whichever is "current"
  const [expandedWeekId, setExpandedWeekId] = useState<string | null>(
    () => roadmap?.weeks?.find((w) => w.status === "current")?.id ?? null,
  );

  const markTopicDone = async (
    weekId: string,
    topicId: string,
    currentlyDone: boolean,
  ) => {
    try {
      await updateProgress({
        id: weekId,
        topicId,
        done: !currentlyDone,
      }).unwrap();
    } catch {
      // handled globally
    }
  };

  const toggleCard = (week: Week) => {
    if (week.status === "locked") return; // locked weeks don't expand
    setExpandedWeekId((prev) => (prev === week.id ? null : week.id));
  };

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (isError || !roadmap) {
    return (
      <Empty description="No roadmap found yet" style={{ display: "90vh" }}>
        <Button onClick={() => refetch()}>রিফ্রেশ করো</Button>
      </Empty>
    );
  }

  const completedCount = roadmap.weeks.filter(
    (w) => w.status === "done",
  ).length;
  const totalCount = roadmap.weeks.length;

  return (
    <div id="rm-result">
      <div className="rm-header">
        <div>
          <div className="rm-goal">{roadmap.goal}</div>
          <div className="rm-meta">
            {roadmap.language} &nbsp;·&nbsp; {roadmap.hoursPerDay} ঘন্টা/দিন
            &nbsp;·&nbsp; আনুমানিক {totalCount} সপ্তাহ
          </div>
        </div>
        <div className="badge">
          {completedCount}/{totalCount} কমপ্লিট
        </div>
      </div>

      {!roadmap.weeks?.length ? (
        <Empty description="No weeks in this plan yet" />
      ) : (
        <div className="track">
          {roadmap.weeks.map((week) => {
            const isOpen = expandedWeekId === week.id;
            const isLocked = week.status === "locked";
            const isDone = week.status === "done";
            const isCurrent = week.status === "current";

            return (
              <div className={`node ${week.status}`} key={week.id}>
                <div className="node-dot">
                  {isDone ? "✓" : isCurrent ? "●" : week.order}
                </div>

                <div
                  className={`card ${isOpen ? "open" : ""}`}
                  onClick={() => toggleCard(week)}
                  style={{ cursor: isLocked ? "default" : "pointer" }}
                >
                  <div className="card-top">
                    <div className="card-title">
                      <span className="week-tag">WK {week.order}</span>
                      {week.title}
                    </div>

                    {isDone && <div className="card-time">সম্পন্ন</div>}

                    {isCurrent && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div className="card-time">
                          চলছে
                          {typeof week.estimatedHoursLeft === "number" &&
                            ` · ${week.estimatedHoursLeft}ঘ বাকি`}
                        </div>
                        <span className="chev">{isOpen ? "⌄" : "›"}</span>
                      </div>
                    )}

                    {!isDone && !isCurrent && !isLocked && (
                      <span className="chev">{isOpen ? "⌄" : "›"}</span>
                    )}

                    {isLocked && <div className="card-time">লক করা</div>}
                  </div>

                  {!isLocked && isOpen && (
                    <div className="card-body">
                      <div className="topic-list">
                        {week.topics?.map((t) => (
                          <div
                            key={t.id}
                            className="topic"
                            onClick={(e) => {
                              e.stopPropagation(); // don't collapse the card
                              markTopicDone(week.id, t.id, t.done);
                            }}
                            style={
                              t.done
                                ? {
                                    color: "var(--muted)",
                                    textDecoration: "line-through",
                                  }
                                : undefined
                            }
                          >
                            <span
                              className="tdot"
                              style={
                                t.done
                                  ? {
                                      background: "var(--mint)",
                                      borderColor: "var(--mint)",
                                    }
                                  : undefined
                              }
                            />
                            {t.text}
                          </div>
                        ))}
                      </div>

                      {week.resource && (
                        <div className="res">📺 সাজেস্টেড: {week.resource}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
