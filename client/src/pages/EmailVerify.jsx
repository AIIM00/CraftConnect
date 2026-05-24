import * as React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../context/AppContext";
import Btn from "../components/Btn";

import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
const EmailVerify = () => {
  const { backendUrl } = React.useContext(AppContext);
  const navigate = useNavigate();

  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = React.useState(false);
  const [timer, setTimer] = React.useState(180);

  const inputsRef = React.useRef([]);

  const handleChange = (value, index) => {
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

  const handleSendCode = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {},
        { withCredentials: true },
      );

      setTimer(180);
      setCode(["", "", "", "", "", ""]);
      toast.success(data.message || "Code sent to your email");

      setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 100);
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
        { withCredentials: true },
      );

      if (!data.success) {
        toast.error(data.message || "Verification failed");
        return;
      }

      toast.success(data.message || "Email verified successfully");
      navigate(-2);
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
              One last step to secure your account.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-white/80">
              Verify your email to protect your profile, receive updates, and
              safely continue using CraftConnect.
            </p>
          </div>

          <div className="relative z-10 grid gap-4">
            {[
              "Protect your account",
              "Receive platform notifications",
              "Access all CraftConnect features",
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
                onClick={() => navigate(-1)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border-soft bg-background p-0 text-primary shadow-soft transition hover:bg-background-light"
                aria-label="Go back"
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
                  <MarkEmailUnreadOutlinedIcon sx={{ fontSize: 44 }} />
                </div>

                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-secondary">
                  Email Verification
                </p>

                <h1 className="font-heading text-3xl font-bold text-primary">
                  Verify Your Email
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-text-muted">
                  Enter the 6-digit verification code sent to your email address
                  to activate your account.
                </p>
              </div>

              <form onSubmit={handleVerify} className="mt-10">
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
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="h-12 w-11 rounded-xl border border-border-soft bg-background text-center text-lg font-bold text-primary shadow-soft outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:w-12"
                    />
                  ))}
                </div>

                <Btn
                  type="submit"
                  variant="ghost"
                  disabled={loading}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-gradient px-6 py-4 text-base font-semibold text-white shadow-card transition duration-300 hover:scale-[1.01] hover:shadow-elevated disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <MarkEmailReadOutlinedIcon fontSize="small" />
                  {loading ? "Verifying..." : "Verify Email"}
                </Btn>

                <Btn
                  type="button"
                  variant="ghost"
                  onClick={handleSendCode}
                  disabled={timer > 0 || loading}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-border-soft bg-background px-6 py-4 text-sm font-semibold text-secondary shadow-soft transition hover:bg-background-light hover:text-secondary-hover disabled:cursor-not-allowed disabled:opacity-50"
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
        </main>
      </div>
    </section>
  );
};

export default EmailVerify;
