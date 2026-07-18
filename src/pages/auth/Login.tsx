import { Controller, useForm, type FieldValues } from "react-hook-form";
import { Input, Button } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./Auth.css";
import { useLoginMutation } from "../../redux/api/features/auth/authApi";
import { useAppDispatch } from "../../redux/hooks";
import { setCredentials } from "../../redux/api/features/auth/authSlice";
import {
  loginWithGoogle,
  signInWithEmailPassword,
} from "../../firebase/services/firebaseAuth";

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "a@gmail.com", password: "admin123" },
  });

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // const [registerUser] = useLoginMutation();

  const onSubmit = async (values: FieldValues) => {
    try {
      // console.log(values)
      const { email, name, password } = values;
      const response = await signInWithEmailPassword(email, password);

      const userData = {
        name: name, // response e name = null
        email: response?.user?.email,
        password: password,
      };

      const res = await login(userData).unwrap();
      // console.log("login.tsx",res);
      dispatch(setCredentials(res));
      toast.success("Welcome back!");
      const redirectTo =
        location.state?.from?.pathname ||
        (res.user?.role === "admin" ? "/admin" : "/student");
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      // handled globally
      toast.error(err?.data?.message, {
        position: "top-center",
      });
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await loginWithGoogle(); // pick--> photoURL / displayName / email

      const { photoURL, displayName, email } = result.user;

      const userData = {
        name: displayName,
        email: email,
        avatar: photoURL,
      };

      const res = await login(userData).unwrap();
      dispatch(setCredentials(res));
      toast.success("Account created — let's build your roadmap");
      navigate("/student", { replace: true });
    } catch (err: any) {
      // handled globally
      toast.error(err?.data?.message, {
        position: "top-center",
      });
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
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 4,
              marginTop: "10px",
            }}
          >
            <Button
              type="default"
              shape="square"
              size="large"
              onClick={handleGoogleSignup}
              icon={
                <img
                  src="https://img.icons8.com/color/48/google-logo.png"
                  alt="Google"
                  width={20}
                  height={20}
                />
              }
            />
          </span>
        </form>

        <div className="auth-footer">
          No account yet? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
