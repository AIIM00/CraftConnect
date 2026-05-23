import * as React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

// Components
import Btn from "../components/Btn";

// MUI Icons
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import LockIcon from "@mui/icons-material/Lock";

import {
  glassPage,
  glassCard,
  glassNav,
  glassIconBtn,
  glassCenterIcon,
  glassTitle,
  glassSmallText,
  glassInputWrap,
  glassLabel,
  glassInputBox,
  glassInput,
  glassSubmit,
  glassOtpRow,
  glassOtpInput,
  glassSecondaryAction,
} from "../styles/glassTailwind";

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

  const handleSendCode = async (e) => {
    if (e) e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email },
      );

      setTimer(180);
      setCode(["", "", "", "", "", ""]);
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
          email,
          enteredOtp,
        },
      );

      if (data.success) {
        toast.success(data.message || "Code verified");
        setStep(3);
      } else {
        toast.error(data.message || "Invalid code");
      }
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
    <div className={glassPage}>
      <div className={glassCard}>
        <div className={glassNav}>
          <Btn
            type="button"
            variant="ghost"
            onClick={() => navigate("/login")}
            className={glassIconBtn}
            aria-label="Back to login"
          >
            <KeyboardArrowLeftIcon sx={{ fontSize: 30 }} />
          </Btn>

          <Btn
            type="button"
            variant="ghost"
            onClick={() => navigate("/")}
            className={glassIconBtn}
            aria-label="Go home"
          >
            <HomeFilledIcon sx={{ fontSize: 26 }} />
          </Btn>
        </div>

        <div className={glassCenterIcon}>
          <MarkEmailReadOutlinedIcon sx={{ fontSize: 58 }} />
        </div>

        <h1 className={glassTitle}>Reset Password</h1>

        {step === 1 && (
          <>
            <p className={glassSmallText}>
              Enter your email address and we’ll send you a 6-digit reset code.
            </p>

            <form onSubmit={handleSendCode}>
              <div className={`${glassInputWrap} mt-6`}>
                <label className={glassLabel}>Email address</label>

                <div className={glassInputBox}>
                  <MarkEmailReadOutlinedIcon />

                  <input
                    disabled={loading}
                    type="email"
                    placeholder="Enter your email"
                    className={glassInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Btn
                type="submit"
                variant="ghost"
                disabled={loading}
                className={glassSubmit}
              >
                {loading ? "Sending..." : "Send Code"}
              </Btn>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className={`${glassSmallText} [&_b]:text-accent`}>
              Enter the 6-digit code sent to <b>{email}</b>.
            </p>

            <form onSubmit={handleVerifyCode}>
              <div className={glassOtpRow}>
                {code.map((digit, index) => (
                  <input
                    disabled={loading}
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    ref={(el) => (inputsRef.current[index] = el)}
                    onChange={(e) => handleCodeChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={glassOtpInput}
                  />
                ))}
              </div>

              <Btn
                type="submit"
                variant="ghost"
                disabled={loading}
                className={glassSubmit}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Btn>

              <Btn
                type="button"
                variant="ghost"
                onClick={handleSendCode}
                disabled={timer > 0 || loading}
                className={glassSecondaryAction}
              >
                {loading
                  ? "Sending..."
                  : timer > 0
                    ? `Resend Code in ${formatTime(timer)}`
                    : "Resend Code"}
              </Btn>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <p className={glassSmallText}>
              Your code is verified. Create a new password for your account.
            </p>

            <form onSubmit={handleResetPassword}>
              <div className={`${glassInputWrap} mt-6`}>
                <label className={glassLabel}>New Password</label>

                <div className={glassInputBox}>
                  <LockIcon />

                  <input
                    disabled={loading}
                    type="password"
                    placeholder="Enter new password"
                    className={glassInput}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <Btn
                type="submit"
                variant="ghost"
                disabled={loading}
                className={glassSubmit}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Btn>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
