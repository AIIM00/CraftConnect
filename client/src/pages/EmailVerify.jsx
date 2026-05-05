import * as React from "react";
import { useNavigate } from "react-router-dom";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl } = React.useContext(AppContext);

  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const inputsRef = React.useRef([]);

  const handleChange = (value, index) => {
    console.log(value);
    if (!/^[0-9]?$/.test(value)) return; // only allow numbers

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move back on backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = code.join("");
    if (otpCode.length !== 6) {
      toast.error("Please ente the 6-digit code");
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp: otpCode },
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };
  const handleResend = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
      );
      if (data.success) {
        setTimer(180); // restart countdown after resend
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
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
            onClick={() => navigate("/")}
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

        <h1 className="text-3xl font-extrabold text-text mb-3">Verify Email</h1>

        <p className="text-text-muted text-sm mb-8 leading-relaxed">
          Please verify your email address to continue using your account.
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-xl font-bold text-text bg-bg border border-text-muted/30 rounded-xl outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft transition"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-accent text-white font-bold shadow-md hover:bg-accent-hover transition"
          >
            Verify
          </button>

          <button
            type="button"
            disabled={timer > 0}
            className={`text-sm font-semibold transition ${
              timer > 0
                ? "text-text-muted cursor-not-allowed"
                : "text-primary hover:text-primary-light"
            }`}
            onClick={async () => {
              handleResend;
            }}
          >
            {timer > 0 ? `Resend Code in ${formatTime(timer)}` : "Resend Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
