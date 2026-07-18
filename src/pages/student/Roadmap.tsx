import { useState } from "react";
import { Controller, useForm, type FieldValues } from "react-hook-form";
import {
  Button,
  Input,
  Radio,
  Slider,
  Skeleton,
  Empty,
  Tag,
  Collapse,
  AutoComplete,
} from "antd";
import { RightOutlined, CheckOutlined } from "@ant-design/icons";
import { toast } from "sonner";

import "./Student.css";
import "../auth/Auth.css";
import { useUpdateProgressMutation } from "../../redux/api/features/roadmap/progressApi";
import {
  useGenerateRoadmapMutation,
  useGetMyRoadmapQuery,
} from "../../redux/api/features/roadmap/roadmapApi";
import { TECH_STACKS } from "../../utils/techStack";
import { useNavigate } from "react-router-dom";

const levelOptions = [
  { label: "Complete beginner", value: "beginner" },
  { label: "Know the basics", value: "basic" },
  { label: "Intermediate", value: "intermediate" },
];

// const languageOptions = ["C++", "Python", "Java", "JavaScript"];

export default function Roadmap() {
  const { data, isLoading } = useGetMyRoadmapQuery(undefined);
  const [generateRoadmap, { isLoading: isGenerating }] =
    useGenerateRoadmapMutation();
  const [updateProgress] = useUpdateProgressMutation();
  const [showForm, setShowForm] = useState(true);

  const navigate = useNavigate();

  const roadmap = data?.data;

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
      // console.log(values);
      const response = await generateRoadmap(values).unwrap();
      const roadmapId = response?.data?._id;
      if (!roadmapId) {
        toast.error(
          "Roadmap saved but no id was returned — check the API response shape.",
        );
        return;
      }

      toast.success("Roadmap generated");
      navigate(`me/${roadmapId}`);
      // setShowForm(false);
      // refetch(); //  generate korar por ek e page e info dekanor jonne
    } catch(err:any) {
          // handled globally
          toast.error(err?.message);
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
    } catch(err:any) {
          // handled globally
          toast.error(err?.message);
        }
  };

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

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
                <Slider
                  {...field}
                  min={1}
                  max={8}
                  marks={{ 1: "1h", 8: "8h" }}
                />
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
                  ) ||
                  "Please enter a valid programming language or framework.",
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

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div>
          <div className="eyebrow">Study plan</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
            {roadmap.goal}
          </h2>
          <div
            style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}
            className="mono"
          >
            {roadmap.language} · {roadmap.hoursPerDay}h/day · ~
            {roadmap.weeks?.length} weeks
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Tag color="green">
            {roadmap.weeks?.filter((w: any) => w.status === "done").length}/
            {roadmap.weeks?.length} complete
          </Tag>
          <Button onClick={() => setShowForm(true)}>Regenerate</Button>
        </div>
      </div>

      {!roadmap.weeks?.length ? (
        <Empty description="No weeks in this plan yet" />
      ) : (
        <div className="track">
          {roadmap.weeks.map((week: any) => (
            <div className={`node ${week.status}`} key={week.id}>
              <div className="node-dot">
                {week.status === "done" ? <CheckOutlined /> : week.order}
              </div>
              <Collapse
                ghost
                items={[
                  {
                    key: week.id,
                    label: (
                      <div className="week-card-top">
                        <div className="week-title">
                          <span className="week-tag">WK {week.order}</span>
                          {week.title}
                        </div>
                        {week.status === "done" && (
                          <span
                            style={{ color: "var(--mint)", fontSize: 12 }}
                            className="mono"
                          >
                            done
                          </span>
                        )}
                      </div>
                    ),
                    children: (
                      <div className="topic-list">
                        {week.topics?.map((t: any) => (
                          <div
                            key={t.id}
                            className="topic-row-inline"
                            style={{ cursor: "pointer" }}
                            onClick={() => markTopicDone(week.id, t.id, t.done)}
                          >
                            <span
                              className="checkbox"
                              style={
                                t.done
                                  ? {
                                      background: "var(--mint)",
                                      borderColor: "var(--mint)",
                                      color: "#0d1117",
                                    }
                                  : {}
                              }
                            >
                              {t.done && (
                                <CheckOutlined style={{ fontSize: 9 }} />
                              )}
                            </span>
                            <span
                              style={
                                t.done
                                  ? {
                                      color: "var(--muted)",
                                      textDecoration: "line-through",
                                    }
                                  : {}
                              }
                            >
                              {t.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                ]}
                className="week-card"
                expandIcon={({ isActive }) => (
                  <RightOutlined
                    rotate={isActive ? 90 : 0}
                    style={{ color: "var(--muted)" }}
                  />
                )}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
