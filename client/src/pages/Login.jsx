import * as React from "react";
import Btn from "../components/Btn";

// MUI Imports
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

//ICONS
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const Login = () => {
  // Navigation hook
  const navigate = useNavigate();
  // Accessing backend URL and login state from context
  const { backendUrl, setIsLoggedIn, getUserData } =
    React.useContext(AppContext);

  // State to toggle between Login and Create Account
  const [state, setState] = React.useState("Login");

  const [role, setRole] = React.useState("");
  // Form data state
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  // Form submission handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Create") {
        // Signup logic
        const { data } = await axios.post(
          `${backendUrl}/api/auth/register`,
          formData,
        );
        toast.success("Account created!");
        setState("Login");
        if (data.success) {
          toast.success(data.message);
          setState("Login");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/login`,
          {
            email: formData.email,
            password: formData.password,
          },
          {
            withCredentials: true,
          },
        );

        if (!data.success) {
          toast.error(data.message || "Login failed");
          return;
        }

        setIsLoggedIn(true);

        const user = await getUserData();

        if (!user) {
          toast.error("Failed to load user data");
          return;
        }

        const userRole = user?.role?.toUpperCase();
        const craftsmanStatus = user?.craftsman?.status?.toUpperCase();

        if (userRole === "ADMIN" || userRole === "SUPERADMIN") {
          navigate("/admin/dashboard", { replace: true });
          return;
        }

        if (userRole === "CUSTOMER") {
          navigate("/", { replace: true });
          return;
        }

        if (userRole === "CRAFTSMAN") {
          const applicationStatus =
            user?.applications?.[0]?.status?.toUpperCase();

          if (craftsmanStatus === "SUSPENDED") {
            navigate("/craftsman/suspended", { replace: true });
          } else if (craftsmanStatus === "APPROVED") {
            navigate("/craftsman/dashboard", { replace: true });
          } else if (applicationStatus === "SUBMITTED") {
            navigate("/craftsman/pending-approval", { replace: true });
          } else {
            navigate("/craftsman/application", { replace: true });
          }

          return;
        }

        navigate("/", { replace: true });
      }
    } catch (err) {
      const message = err.response?.data?.message;
      console.log("ERROR:", err.response?.data);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-r from-primary to-primary-light">
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-text-muted text-sm">
        <div className="mb-10 flex w-full items-center justify-between px-2">
          <Btn
            type="button"
            onClick={() => navigate(-1)}
            variant="outline"
            className="h-12 w-12 rounded-full p-0"
          >
            <KeyboardArrowLeftIcon sx={{ fontSize: 30 }} />
          </Btn>

          <Btn
            type="button"
            onClick={() => navigate("/")}
            variant="outline"
            className="h-12 w-12 rounded-full p-0"
          >
            <HomeFilledIcon sx={{ fontSize: 26 }} />
          </Btn>
        </div>

        <h1 className="text-4xl font-bold text-center mb-3">
          {" "}
          {state === "Create" ? "Create Account" : "Login Page"}
        </h1>
        <p className="text-lg text-center mb-8">
          {state === "Login"
            ? "This is the login page. Please implement the login form here."
            : "This is the signup page. Please implement the signup form here."}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === "Create" && (
            <div className="mb-4 flex w-full items-center gap-3 rounded-full border border-white/30 bg-white/15 px-5 py-3 shadow-[0_0_25px_rgba(255,255,255,0.12)] backdrop-blur-xl transition focus-within:border-primary/40 focus-within:bg-white/25 focus-within:shadow-[0_0_30px_rgba(255,255,255,0.18)]">
              <PersonIcon className="h-5 w-5 text-text-muted" />

              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                type="text"
                placeholder="Full Name"
                required
                className="w-full bg-transparent text-text placeholder:text-text-muted outline-none"
              />
            </div>
          )}
          <div className="mb-4 flex w-full items-center gap-3 rounded-full border border-white/30 bg-white/15 px-5 py-3 shadow-[0_0_25px_rgba(255,255,255,0.12)] backdrop-blur-xl transition focus-within:border-primary/40 focus-within:bg-white/25 focus-within:shadow-[0_0_30px_rgba(255,255,255,0.18)]">
            <MailIcon className="w-5 h-5 text-text-muted" />

            <input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type="email"
              placeholder="Email"
              required
              className="w-full bg-transparent text-text placeholder:text-text-muted outline-none"
            />
          </div>
          <div className="mb-4 flex w-full items-center gap-3 rounded-full border border-white/30 bg-white/15 px-5 py-3 shadow-[0_0_25px_rgba(255,255,255,0.12)] backdrop-blur-xl transition focus-within:border-primary/40 focus-within:bg-white/25 focus-within:shadow-[0_0_30px_rgba(255,255,255,0.18)]">
            <LockIcon className="w-5 h-5 text-text-muted" />
            <input
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              type="password"
              placeholder="Password"
              required
              className="w-full bg-transparent text-text placeholder:text-text-muted outline-none"
            />
          </div>
          {state === "Create" && (
            <div className="mx-auto my-10 grid max-w-md grid-cols-2 gap-4 rounded-3xl border border-white/30 bg-white/10 p-2 shadow-[0_0_35px_rgba(255,255,255,0.14)] backdrop-blur-xl">
              <Btn
                type="button"
                onClick={() => {
                  setRole("CRAFTSMAN");
                  setFormData({ ...formData, role: "CRAFTSMAN" });
                }}
                variant={role === "CRAFTSMAN" ? "primary" : "ghost"}
                className={`rounded-full py-3 font-bold ${
                  role === "CRAFTSMAN"
                    ? ""
                    : "text-text-muted hover:bg-white/10 hover:text-primary"
                }`}
              >
                Craftsman
              </Btn>

              <Btn
                type="button"
                onClick={() => {
                  setRole("CUSTOMER");
                  setFormData({ ...formData, role: "CUSTOMER" });
                }}
                variant={role === "CUSTOMER" ? "primary" : "ghost"}
                className={`rounded-full py-3 font-bold ${
                  role === "CUSTOMER"
                    ? ""
                    : "text-text-muted hover:bg-white/10 hover:text-primary"
                }`}
              >
                Customer
              </Btn>
            </div>
          )}
          <Btn
            type="button"
            onClick={() => navigate("/reset-password")}
            variant="ghost"
            className="mb-4 px-0 py-0 text-sm font-semibold text-primary-light hover:text-primary hover:underline"
          >
            Forgot Password?
          </Btn>
          <Btn type="submit" variant="primary" className="w-full">
            {state}
          </Btn>
          <Btn
            type="button"
            onClick={() => setState(state === "Create" ? "Login" : "Create")}
            variant="ghost"
            className="mx-auto mt-4 px-0 py-0 text-center text-sm font-semibold text-primary-light hover:text-primary hover:underline"
          >
            {state === "Create"
              ? "Already have an account? Login"
              : "Don't have an account? Sign up"}
          </Btn>
        </form>
      </div>
    </div>
  );
};

export default Login;
