import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Input,
  Modal,
  Skeleton,
  Tag,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { toast } from "sonner";

import "../auth/Auth.css";
import { useChangePasswordMutation } from "../../redux/api/features/auth/authApi";
import { useAppDispatch } from "../../hooks/hooks";
import { updateUser } from "../../redux/api/features/auth/authSlice";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "../../redux/api/features/profile/profileApi";
import { changePassword } from "../../firebase/services/firebaseAuth";
import { getFirebaseErrorMessage } from "../../utils/getFirebaseErrorMessage";

export default function Profile() {
  const { data, isLoading } = useGetMyProfileQuery(undefined);
  const [updateProfile, { isLoading: isSaving }] = useUpdateMyProfileMutation();
  const [verifyUser, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const dispatch = useAppDispatch();

  const profile = data?.data;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", phone: "", bio: "" } });

  const {
    control: pwControl,
    handleSubmit: handlePwSubmit,
    reset: resetPw,
    formState: { errors: pwErrors },
  } = useForm({ defaultValues: { currentPassword: "", newPassword: "" } });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, reset]);

  const onSaveProfile = async (values: any) => {
    try {
      const res = await updateProfile(values).unwrap();
      dispatch(updateUser(res.data));
      toast.success("Profile updated");
    } catch (err: any) {
      // handled globally
      toast.error(err?.data?.message, {
        position: "top-center",
      });
    }
  };

  const onChangePassword = async (values: any) => {
    try {
      // console.log(values)

      // here just checking user exist or blocked or not
      await verifyUser(values).unwrap();
      await changePassword(values.currentPassword, values.newPassword);
      toast.success("Password changed");
      resetPw();
    } catch (err: any) {
      // handled globally
      Modal.error({
        title: "Update Failed",
        content: getFirebaseErrorMessage(err),
        centered: true,
      });
    }
  };

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Avatar size={64} src={profile?.avatar} icon={<UserOutlined />} />
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{profile?.name}</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            {profile?.email}
          </div>
          <Tag
            color={profile?.role === "admin" ? "gold" : "green"}
            style={{ marginTop: 6 }}
          >
            {profile?.role?.toUpperCase()}
          </Tag>
        </div>
      </div>

      <Card title="Profile details" className="panel">
        <form onSubmit={handleSubmit(onSaveProfile)}>
          <div style={{ marginBottom: 16 }}>
            <label className="auth-label">Full name</label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input {...field} size="large" prefix={<UserOutlined />} />
              )}
            />
            {errors.name && (
              <div className="auth-error">{errors.name.message}</div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="auth-label">Phone</label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => <Input {...field} size="large" />}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="auth-label">Bio</label>
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={3}
                  placeholder="A short intro…"
                />
              )}
            />
          </div>

          <Button type="primary" htmlType="submit" loading={isSaving}>
            Save changes
          </Button>
        </form>
      </Card>

      <Divider />

      {!profile?.avatar && (
        <Card title="Change password" className="panel">
          <form onSubmit={handlePwSubmit(onChangePassword)}>
            <div style={{ marginBottom: 16 }}>
              <label className="auth-label">Current password</label>
              <Controller
                name="currentPassword"
                control={pwControl}
                rules={{ required: "Current password is required" }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    prefix={<LockOutlined />}
                  />
                )}
              />
              {pwErrors.currentPassword && (
                <div className="auth-error">
                  {pwErrors.currentPassword.message}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="auth-label">New password</label>
              <Controller
                name="newPassword"
                control={pwControl}
                rules={{
                  required: "New password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    prefix={<LockOutlined />}
                  />
                )}
              />
              {pwErrors.newPassword && (
                <div className="auth-error">{pwErrors.newPassword.message}</div>
              )}
            </div>

            <Button htmlType="submit" loading={isChangingPassword}>
              Update password
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
