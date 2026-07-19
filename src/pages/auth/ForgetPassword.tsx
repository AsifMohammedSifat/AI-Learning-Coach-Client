import { Controller, useForm, type FieldValues } from "react-hook-form";
import { Input, Button, Modal } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import "./Auth.css";
import { resetPassword } from "../../firebase/services/firebaseAuth";
import { getFirebaseErrorMessage } from "../../utils/getFirebaseErrorMessage";
import { useState } from "react";

export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "" } });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
//   const navigate = useNavigate();

  const onSubmit = async (values: FieldValues) => {
    try {
      setLoading(true);
      await resetPassword(values.email);
      setSent(true);
      toast.success("Reset link sent! Check your inbox.");
    } catch (err: any) {
      Modal.error({
        title: "Couldn't send reset link",
        content: getFirebaseErrorMessage(err),
        centered: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-title">Reset password</div>
        <div className="auth-sub">
          {sent
            ? "We've sent a reset link to your email."
            : "Enter your email to receive a reset link."}
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    prefix={<MailOutlined style={{ color: "var(--muted)" }} />}
                    placeholder="you@example.com"
                  />
                )}
              />
              {errors.email && (
                <div className="auth-error">{errors.email.message}</div>
              )}
            </div>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{ marginTop: 8 }}
            >
              Send reset link
            </Button>
          </form>
        ) : (
          <Button
            type="default"
            size="large"
            block
            onClick={() => {
              window.open("https://mail.google.com", "_blank");
            }}
            style={{ marginTop: 8 }}
          >
            Open Mail
          </Button>
        )}

        <div className="auth-footer">
          Remembered your password? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
