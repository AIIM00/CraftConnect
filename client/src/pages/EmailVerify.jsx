import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

// Components
import Btn from "../components/Btn";

// MUI Icons
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";

import {
  glassPage,
  glassCard,
  glassNav,
  glassIconBtn,
  glassCenterIcon,
  glassTitle,
  glassSmallText,
  glassSubmit,
  glassOtpRow,
  glassOtpInput,
  glassSecondaryAction,
} from "../styles/glassTailwind";

const EmailVerify = () => {
  const { backendUrl } = React.useContext(AppContext);
  const navigate = useNavigate();

  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = React.useState(false);
  const [timer, setTimer] = React.useState(180);

  const inputsRef = React.useRef([]);

  const handleChange = (value, index) => {
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

  const handleSendCode = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {},
        {
          withCredentials: true,
        },
      );

      setTimer(180);
      setCode(["", "", "", "", "", ""]);
      toast.success(data.message || "Code sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleSendCode();
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();

    const otpCode = code.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { enteredOtp: otpCode },
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        toast.success(data.message);
        navigate(-2);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
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
            onClick={() => navigate(-1)}
            className={glassIconBtn}
            aria-label="Go back"
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

        <h1 className={glassTitle}>Verify Email</h1>

        <p className={glassSmallText}>
          Please enter the 6-digit code sent to your email address to activate
          your account.
        </p>

        <form onSubmit={handleVerify}>
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
                onChange={(e) => handleChange(e.target.value, index)}
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
            {loading ? "Verifying..." : "Verify Email"}
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
      </div>
    </div>
  );
};

export default EmailVerify;
