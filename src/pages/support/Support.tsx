// import { useState } from "react";
// import { Button, Typography, Modal, Rate, Input } from "antd";
// import CategoryPicker from "../../components/CategoryPicker";
// import { useSupportSession } from "../../hooks/useSupportSession";
// import type {
//   TSupportCategory,
//   TSupportLanguage,
// } from "../../redux/api/features/support/supportApi";
// import { useSubmitSupportFeedbackMutation } from "../../redux/api/features/support/supportApi";

// const { Title, Text } = Typography;

// export default function Support() {
//   const {
//     status,
//     category,
//     // sessionId,
//     secondsLeft,
//     screenSharing,
//     transcript,
//     start,
//     end,
//     shareScreen,
//     stopScreenShare,
//   } = useSupportSession();

//   const [submitSupportFeedback, { isLoading: isSubmittingFeedback }] =
//     useSubmitSupportFeedbackMutation();

//   const [pickedCategory, setPickedCategory] =
//     useState<TSupportCategory>("coding");
//   const [pickedLanguage, setPickedLanguage] = useState<TSupportLanguage>("EN");
//   const [feedbackOpen, setFeedbackOpen] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [feedbackText, setFeedbackText] = useState("");

//   const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
//   const ss = String(secondsLeft % 60).padStart(2, "0");

//   if (status === "idle" || status === "connecting") {
//     return (
//       <div>
//         <Title level={3}>Support Lab</Title>
//         <Text type="secondary">
//           Live voice help — coding, mental support, or guidance. Sessions are 10
//           minutes.
//         </Text>
//         <div style={{ margin: "20px 0" }}>
//           <CategoryPicker
//             category={pickedCategory}
//             language={pickedLanguage}
//             onCategoryChange={setPickedCategory}
//             onLanguageChange={setPickedLanguage}
//           />
//         </div>
//         <Button
//           type="primary"
//           loading={status === "connecting"}
//           onClick={() => start(pickedCategory, pickedLanguage)}
//         >
//           Start session
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Text strong>
//         {category} · {mm}:{ss} left
//       </Text>

//       <div style={{ margin: "16px 0", display: "flex", gap: 8 }}>
//         <Button onClick={screenSharing ? stopScreenShare : shareScreen}>
//           {screenSharing ? "Stop screen share" : "Share screen"}
//         </Button>
//         <Button
//           danger
//           onClick={async () => {
//             await end();
//             setFeedbackOpen(true);
//           }}
//         >
//           End session
//         </Button>
//       </div>

//       <div
//         style={{
//           maxHeight: 320,
//           overflowY: "auto",
//           border: "1px solid #eee",
//           borderRadius: 8,
//           padding: 12,
//         }}
//       >
//         {transcript.length === 0 && (
//           <Text type="secondary">Say hello to get started.</Text>
//         )}
//         {transcript.map((t, index) => (
//           <p key={index}>
//             <b>{t.role === "ai" ? "AI" : "You"}:</b> {t.text}
//           </p>
//         ))}
//       </div>

//       <Modal
//         open={feedbackOpen}
//         title="How was this session?"
//         confirmLoading={isSubmittingFeedback}
//         onCancel={() => setFeedbackOpen(false)}
//       >
//         <Rate value={rating} onChange={setRating} />
//         <Input.TextArea
//           style={{ marginTop: 12 }}
//           placeholder="Any feedback?"
//           value={feedbackText}
//           onChange={(e) => setFeedbackText(e.target.value)}
//         />
//       </Modal>
//     </div>
//   );
// }
