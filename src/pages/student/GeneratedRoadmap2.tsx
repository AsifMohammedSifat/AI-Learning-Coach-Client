import { useState } from "react";
import { Controller, useForm, type FieldValues } from "react-hook-form";
import {
  Button,
  Input,
  Radio,
  Slider,
  Skeleton,
  Empty,
  AutoComplete,
} from "antd";
import { toast } from "sonner";

import "./Student.css";
import "../auth/Auth.css";
import { useUpdateProgressMutation } from "../../redux/api/features/roadmap/progressApi";
import {
  useGenerateRoadmapMutation,
  useGetMyRoadmapQuery,
} from "../../redux/api/features/roadmap/roadmapApi";
import { TECH_STACKS } from "../../utils/techStack";

const levelOptions = [
  { label: "Complete beginner", value: "beginner" },
  { label: "Know the basics", value: "basic" },
  { label: "Intermediate", value: "intermediate" },
];

// ---- Types (adjust to match your actual roadmap API shape) ----
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

interface RoadmapData {
  goal: string;
  language: string;
  hoursPerDay: number;
  weeks: Week[];
}

export default function GeneratedRoadMap() {
  const { data, isLoading, refetch } = useGetMyRoadmapQuery(undefined);
  const [generateRoadmap, { isLoading: isGenerating }] =
    useGenerateRoadmapMutation();
  const [updateProgress] = useUpdateProgressMutation();
  const [showForm, setShowForm] = useState(false);

  const roadmap: RoadmapData | undefined = data?.data;

  // which week card is expanded — default to whichever is "current"
  const [expandedWeekId, setExpandedWeekId] = useState<string | null>(
    () => roadmap?.weeks?.find((w) => w.status === "current")?.id ?? null,
  );

  const { control, handleSubmit } = useForm({
    defaultValues: {
      goal: "",
      currentLevel: "basic",
      hoursPerDay: 3,
      language: "",
    },
  });

  const onSubmit = async (values: FieldValues) => {
    try {
      await generateRoadmap(values).unwrap();
      toast.success("Roadmap generated");
      setShowForm(false);
      refetch();
    } catch {
      // handled globally
    }
  };

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

  // ---------------- Generator form (unchanged) ----------------
  if (!roadmap || showForm) {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div className="eyebrow">Study plan generator</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
          Build your learning roadmap
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>
          Tell us your goal and level — we'll turn it into a week-by-week plan.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="panel">
          <div style={{ marginBottom: 20 }}>
            <label className="auth-label">Your goal</label>
            <Controller
              name="goal"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={3}
                  placeholder="e.g. Reach a 1400+ Codeforces rating in 3 months"
                />
              )}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="auth-label">Current level</label>
            <Controller
              name="currentLevel"
              control={control}
              render={({ field }) => (
                <Radio.Group {...field} optionType="button" buttonStyle="solid">
                  {levelOptions.map((o) => (
                    <Radio.Button key={o.value} value={o.value}>
                      {o.label}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              )}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="auth-label">Hours per day</label>
            <Controller
              name="hoursPerDay"
              control={control}
              render={({ field }) => (
                <Slider {...field} min={1} max={8} marks={{ 1: "1h", 8: "8h" }} />
              )}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="auth-label">Preferred language</label>
            <Controller
              name="language"
              control={control}
              rules={{
                required: "Language is required",
                validate: (value) =>
                  TECH_STACKS.some(
                    (item) => item.toLowerCase() === value.trim().toLowerCase(),
                  ) || "Please enter a valid programming language or framework.",
              }}
              render={({ field, fieldState }) => (
                <>
                  <AutoComplete
                    {...field}
                    options={TECH_STACKS.map((item) => ({ value: item }))}
                    placeholder="e.g. C++, React, Node.js"
                    filterOption={(input, option) =>
                      (option?.value ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    style={{ width: 200 }}
                    onChange={field.onChange}
                    value={field.value}
                  />
                  {fieldState.error && (
                    <div style={{ color: "red", marginTop: 4 }}>
                      {fieldState.error.message}
                    </div>
                  )}
                </>
              )}
            />
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={isGenerating}
            block
            size="large"
          >
            ⚡ Generate roadmap
          </Button>
        </form>
      </div>
    );
  }

  // ---------------- Result view (matches your HTML mock) ----------------
  const completedCount = roadmap.weeks.filter((w) => w.status === "done").length;
  const totalCount = roadmap.weeks.length;

  return (
    <div id="rm-result">
      <button className="backbtn" onClick={() => setShowForm(true)}>
        ← এডিট করো
      </button>

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
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                                ? { color: "var(--muted)", textDecoration: "line-through" }
                                : undefined
                            }
                          >
                            <span
                              className="tdot"
                              style={
                                t.done
                                  ? { background: "var(--mint)", borderColor: "var(--mint)" }
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
