import { Controller, useForm, type FieldValues } from "react-hook-form";
import { Input, Button } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./Auth.css";
import { useLoginMutation } from "../../redux/api/features/auth/authApi";
import { useAppDispatch } from "../../redux/hooks";
import { setCredentials } from "../../redux/api/features/auth/authSlice";

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "a@gmail.com", password: "123" } });

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (values:FieldValues) => {
    try {
      const res = await login(values).unwrap();
      dispatch(setCredentials(res));
      toast.success("Welcome back!");
      const redirectTo =
        location.state?.from?.pathname ||
        (res.user?.role === "admin" ? "/admin" : "/student");
      navigate(redirectTo, { replace: true });
    } catch (err:any) {
      // apiSlice already toasts the server error message
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-title">Log in</div>
        <div className="auth-sub">Continue your learning roadmap.</div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
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
            {errors.email && <div className="auth-error">{errors.email.message}</div>}
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  size="large"
                  prefix={<LockOutlined style={{ color: "var(--muted)" }} />}
                  placeholder="••••••••"
                />
              )}
            />
            {errors.password && (
              <div className="auth-error">{errors.password.message}</div>
            )}
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
            style={{ marginTop: 8 }}
          >
            Log in
          </Button>
        </form>

        <div className="auth-footer">
          No account yet? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
