// src/components/ErrorModal.tsx
import { useEffect, useState } from "react";
import { Modal, Typography } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import { colors } from "../styles/theme";
const { Text } = Typography;

interface ErrorModalProps {
  message?: string | string[] | null;
  title?: string;
  onClose?: () => void;
}

export function ErrorModal({
  message,
  title = "Something went wrong",
  onClose,
}: ErrorModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!message);
  }, [message]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const messages = Array.isArray(message) ? message : message ? [message] : [];

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      onOk={handleClose}
      okText="Close"
      cancelButtonProps={{ style: { display: "none" } }}
      centered
      className="error-modal"
      title={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CloseCircleFilled style={{ color: colors.coral }} />
          {title}
        </span>
      }
      styles={{
        header: { background: colors.surface },
        body: { paddingTop: 8, background: colors.surface },
      }}
      okButtonProps={{
        style: { background: colors.coral, borderColor: colors.coral },
      }}
    >
      {messages.length > 1 ? (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {messages.map((m, i) => (
            <li key={i}>
              <Text style={{ color: colors.text }}>{m}</Text>
            </li>
          ))}
        </ul>
      ) : (
        <Text style={{ color: colors.text }}>
          {messages[0] ?? "An unexpected error occurred."}
        </Text>
      )}
    </Modal>
  );
}