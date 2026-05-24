import * as React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../context/AppContext";
import Btn from "../components/Btn";

import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import LockIcon from "@mui/icons-material/Lock";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import PasswordIcon from "@mui/icons-material/Password";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = React.useContext(AppContext);

  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [timer, setTimer] = React.useState(180);

  const inputsRef = React.useRef([]);

  const steps = [
    { id: 1, label: "Email" },
    { id: 2, label: "Code" },
    { id: 3, label: "Password" },
  ];

  const handleSendCode = async (e) => {
    if (e) e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email: email.trim() },
      );

      setTimer(180);
      setCode(["", "", "", "", "", ""]);
      toast.success(data.message || "Code sent to your email");
      setStep(2);

      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updatedCode = [...code];
    updatedCode[index] = value;
    setCode(updatedCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    const enteredOtp = code.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-reset-otp`,
        {
          email: email.trim(),
          enteredOtp,
        },
      );

      if (!data.success) {
        toast.error(data.message || "Invalid code");
        return;
      }

      toast.success(data.message || "Code verified");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const enteredOtp = code.join("");

    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email: email.trim(),
          enteredOtp,
          newPassword,
        },
      );

      toast.success(data.message || "Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (timer <= 0 || step !== 2) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, step]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const title =
    step === 1
      ? "Reset Your Password"
      : step === 2
        ? "Check Your Email"
        : "Create New Password";

  const description =
    step === 1
      ? "Enter your email and we’ll send you a secure 6-digit reset code."
      : step === 2
        ? `Enter the 6-digit code sent to ${email}.`
        : "Your code is verified. Choose a new password to secure your account.";

  return (
    <section className="min-h-screen bg-background-dark px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-container grid-cols-1 overflow-hidden rounded-none border-0 bg-transparent shadow-none lg:grid-cols-[1.05fr_0.95fr] lg:rounded-2xl lg:border lg:border-border-soft lg:bg-background lg:shadow-glass">
        <aside className="relative hidden overflow-hidden bg-primary-gradient p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-14 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
              <div className="h-3 w-3 rounded-full bg-secondary" />
              <span className="text-sm font-semibold">CraftConnect</span>
            </div>

            <h1 className="max-w-xl font-heading text-5xl font-bold leading-tight">
              Recover access securely and quickly.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-white/80">
              We’ll verify your email first, then let you create a new password
              for your CraftConnect account.
            </p>
          </div>

          <div className="relative z-10 grid gap-4">
            {[
              "Secure email verification",
              "Protected password reset",
              "Fast account recovery",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
              >
                <VerifiedIcon className="text-secondary" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="relative flex items-center justify-center bg-transparent p-0 lg:bg-background lg:p-12">
          <div className="absolute inset-0 bg-hero-gradient opacity-80" />

          <div className="relative z-10 w-full max-w-md">
            <div className="mb-8 flex items-center justify-between">
              <Btn
                type="button"
                variant="ghost"
                onClick={() => navigate("/login")}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border-soft bg-background p-0 text-primary shadow-soft transition hover:bg-background-light"
                aria-label="Back to login"
              >
                <KeyboardArrowLeftIcon sx={{ fontSize: 30 }} />
              </Btn>

              <Btn
                type="button"
                variant="ghost"
                onClick={() => navigate("/")}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border-soft bg-background p-0 text-primary shadow-soft transition hover:bg-background-light"
                aria-label="Go home"
              >
                <HomeFilledIcon sx={{ fontSize: 26 }} />
              </Btn>
            </div>

            <div className="rounded-none border-0 bg-transparent p-6 shadow-none lg:rounded-2xl lg:border lg:border-border-soft lg:bg-card-gradient lg:p-8 lg:shadow-card">
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
                  {step === 1 && (
                    <MarkEmailReadOutlinedIcon sx={{ fontSize: 44 }} />
                  )}
                  {step === 2 && <ShieldOutlinedIcon sx={{ fontSize: 44 }} />}
                  {step === 3 && <PasswordIcon sx={{ fontSize: 44 }} />}
                </div>

                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-secondary">
                  Account Recovery
                </p>

                <h1 className="font-heading text-3xl font-bold text-primary">
                  {title}
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-text-muted">
                  {description}
                </p>
              </div>

              <div className="my-8 grid grid-cols-3 gap-3">
                {steps.map((item) => {
                  const active = step >= item.id;

                  return (
                    <div key={item.id} className="space-y-2">
                      <div
                        className={`h-2 rounded-full transition ${
                          active
                            ? "bg-secondary-gradient"
                            : "bg-background-light"
                        }`}
                      />
                      <p
                        className={`text-center text-xs font-semibold ${
                          active ? "text-primary" : "text-text-muted"
                        }`}
                      >
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {step === 1 && (
                <form onSubmit={handleSendCode} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text">
                      Email Address
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-background px-4 py-3.5 text-text-muted shadow-soft transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
                      <MarkEmailReadOutlinedIcon fontSize="small" />

                      <input
                        disabled={loading}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full bg-transparent text-text outline-none placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-70"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <Btn
                    type="submit"
                    variant="ghost"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary-gradient px-6 py-4 text-base font-semibold text-white shadow-card transition duration-300 hover:scale-[1.01] hover:shadow-elevated disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Send Reset Code"}
                  </Btn>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleVerifyCode} className="space-y-5">
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {code.map((digit, index) => (
                      <input
                        disabled={loading}
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        ref={(el) => {
                          inputsRef.current[index] = el;
                        }}
                        onChange={(e) =>
                          handleCodeChange(e.target.value, index)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="h-12 w-11 rounded-xl border border-border-soft bg-background text-center text-lg font-bold text-primary shadow-soft outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:w-12"
                      />
                    ))}
                  </div>

                  <Btn
                    type="submit"
                    variant="ghost"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary-gradient px-6 py-4 text-base font-semibold text-white shadow-card transition duration-300 hover:scale-[1.01] hover:shadow-elevated disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </Btn>

                  <Btn
                    type="button"
                    variant="ghost"
                    onClick={handleSendCode}
                    disabled={timer > 0 || loading}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-border-soft bg-background px-6 py-4 text-sm font-semibold text-secondary shadow-soft transition hover:bg-background-light hover:text-secondary-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Sending..."
                      : timer > 0
                        ? `Resend Code in ${formatTime(timer)}`
                        : "Resend Code"}
                  </Btn>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text">
                      New Password
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-background px-4 py-3.5 text-text-muted shadow-soft transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
                      <LockIcon fontSize="small" />

                      <input
                        disabled={loading}
                        type="password"
                        placeholder="Enter new password"
                        className="w-full bg-transparent text-text outline-none placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-70"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <Btn
                    type="submit"
                    variant="ghost"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-primary-gradient px-6 py-4 text-base font-semibold text-white shadow-card transition duration-300 hover:scale-[1.01] hover:shadow-elevated disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Btn>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default ResetPassword;
