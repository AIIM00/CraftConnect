import * as React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = React.useContext(AppContext);

  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const inputsRef = React.useRef([]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        {
          email,
        },
      );
      setTimer(180);
      toast.success(data.message || "Code sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const enteredOtp = code.join("");

      if (enteredOtp.length !== 6) {
        toast.error("Please enter the 6-digit code");
        return;
      }
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-reset-otp`,
        {
          email,
          enteredOtp,
        },
      );
      if (data.success) {
        toast.success(data.message);
        setStep(3);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
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
          email,
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

  const [timer, setTimer] = React.useState(180); // 3 minutes
  React.useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-soft via-bg to-primary-light px-4">
      <div className="relative w-full max-w-md bg-surface rounded-3xl shadow-2xl px-8 py-10 text-center">
        <div className="flex justify-between items-center w-full px-2 mb-10">
          <KeyboardArrowLeftIcon
            onClick={() => navigate("/login")}
            sx={{ fontSize: 52 }}
            className="text-accent hover:text-accent-hover hover:bg-gray-300 rounded-full cursor-pointer transition"
          />

          <HomeFilledIcon
            onClick={() => navigate("/")}
            sx={{ fontSize: 52 }}
            className="text-accent p-2 hover:text-accent-hover hover:bg-gray-300 rounded-full cursor-pointer transition"
          />
        </div>

        <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-accent-soft flex items-center justify-center">
          <MarkEmailReadOutlinedIcon
            sx={{ fontSize: 58 }}
            className="text-primary"
          />
        </div>

        <h1 className="text-3xl font-extrabold text-text mb-3">
          Reset Password
        </h1>

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-6">
            <p className="text-text-muted text-sm mb-6">
              Enter your email and we’ll send you a reset code.
            </p>

            <input
              disabled={loading}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl bg-bg border border-text-muted/30 outline-none focus:border-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-accent text-white font-bold hover:bg-accent-hover transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <p className="text-text-muted text-sm mb-6">
              Enter the 6-digit code sent to <b>{email}</b>.
            </p>

            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  disabled={loading}
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleCodeChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 text-center text-xl font-bold text-text bg-bg border border-text-muted/30 rounded-xl outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft transition"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-accent text-white font-bold hover:bg-accent-hover transition"
            >
              Verify Code
            </button>

            <button
              type="button"
              onClick={handleSendCode}
              disabled={timer > 0}
              className={`text-sm font-semibold text-primary hover:text-primary-light transition ${
                timer > 0
                  ? "text-text-muted cursor-not-allowed"
                  : "text-primary hover:text-primary-light"
              }`}
            >
              {timer > 0
                ? `Resend Code in ${formatTime(timer)}`
                : "Resend Code"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <p className="text-text-muted text-sm mb-6">
              Enter your new password.
            </p>

            <input
              type="password"
              placeholder="New password"
              className="w-full px-4 py-3 rounded-xl bg-bg border border-text-muted/30 outline-none focus:border-accent"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-accent text-white font-bold hover:bg-accent-hover transition disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
