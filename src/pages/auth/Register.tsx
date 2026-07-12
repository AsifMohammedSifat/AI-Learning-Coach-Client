import { Controller, useForm } from "react-hook-form";
import { Input, Button } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./Auth.css";
import { useRegisterMutation } from "../../redux/api/features/auth/authApi";
import { useAppDispatch } from "../../redux/hooks";
import { setCredentials } from "../../redux/api/features/auth/authSlice";

export default function Register() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const [registerUser, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async ({ ...values }) => {
    try {
      const res = await registerUser({ ...values, role: "student" }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Account created — let's build your roadmap");
      navigate("/student", { replace: true });
    } catch (err) {
      // apiSlice already toasts the server error message
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-title">Create your account</div>
        <div className="auth-sub">
          Start with a plan built around your goal.
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-field">
            <label className="auth-label">Full name</label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  prefix={<UserOutlined style={{ color: "var(--muted)" }} />}
                  placeholder="Your name"
                />
              )}
            />
            {errors.name && (
              <div className="auth-error">{errors.name.message}</div>
            )}
          </div>

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

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              }}
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

          <div className="auth-field">
            <label className="auth-label">Confirm password</label>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your password",
                validate: (v) =>
                  v === watch("password") || "Passwords don't match",
              }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  size="large"
                  prefix={<LockOutlined style={{ color: "var(--muted)" }} />}
                  placeholder="••••••••"
                />
              )}
            />
            {errors.confirmPassword && (
              <div className="auth-error">{errors.confirmPassword.message}</div>
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
            Create account
          </Button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
