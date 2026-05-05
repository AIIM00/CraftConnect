import * as React from "react";
import { useNavigate } from "react-router-dom";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const inputsRef = React.useRef([]);

  const handleChange = (value, index) => {
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
          />{" "}
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

        <p className="text-text-muted text-sm mb-8 leading-relaxed">
          Enter the verification code sent to your email to continue resetting
          your password.
        </p>

        <form className="space-y-6">
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
            Confirm Code
          </button>

          <button
            type="button"
            className="text-sm font-semibold text-primary hover:text-primary-light transition"
          >
            Resend Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
