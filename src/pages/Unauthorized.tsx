import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Result
        status="403"
        title="403"
        subTitle="You don't have access to this page."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Back to home
          </Button>
        }
      />
    </div>
  );
};

export default Unauthorized;
