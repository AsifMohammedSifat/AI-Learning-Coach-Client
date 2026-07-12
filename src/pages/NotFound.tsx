import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Result
        status="404"
        title="404"
        subTitle="This page doesn't exist."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Back to home
          </Button>
        }
      />
    </div>
  );
}
