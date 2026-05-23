import * as React from "react";
import Btn from "../components/Btn";

// MUI Imports
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

import {
  glassPage,
  glassCard,
  glassNav,
  glassIconBtn,
  glassLogo,
  glassTitle,
  glassSubtitle,
  glassInputWrap,
  glassLabel,
  glassInputBox,
  glassInput,
  glassRoleBox,
  glassRoleBtn,
  glassRoleBtnActive,
  glassLink,
  glassSubmit,
  glassSwitch,
  glassSwitchBtn,
} from "../styles/glassTailwind";

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } =
    React.useContext(AppContext);

  const [state, setState] = React.useState("Login");
  const [role, setRole] = React.useState("");

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Create") {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/register`,
          formData,
        );

        if (data.success) {
          toast.success(data.message || "Account created!");
          setState("Login");
        } else {
          toast.error(data.message || "Failed to create account");
        }

        return;
      }

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
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      console.log("ERROR:", err.response?.data);
      toast.error(message);
    }
  };

  return (
    <div className={glassPage}>
      <div className={`${glassCard} p-20 rounded-3xl`}>
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

        <div className={glassLogo} />

        <h1 className={glassTitle}>
          {state === "Create" ? "Create Account" : "Welcome Back"}
        </h1>

        <p className={glassSubtitle}>
          {state === "Login"
            ? "Login to continue to CraftConnect"
            : "Create your CraftConnect account"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Create" && (
            <div className={glassInputWrap}>
              <label className={glassLabel}>Full Name</label>

              <div className={glassInputBox}>
                <PersonIcon />

                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className={glassInput}
                />
              </div>
            </div>
          )}

          <div className={glassInputWrap}>
            <label className={glassLabel}>Email address</label>

            <div className={glassInputBox}>
              <MailIcon />

              <input
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                type="email"
                placeholder="Enter your email"
                required
                className={glassInput}
              />
            </div>
          </div>

          <div className={glassInputWrap}>
            <label className={glassLabel}>Password</label>

            <div className={glassInputBox}>
              <LockIcon />

              <input
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                type="password"
                placeholder="Enter your password"
                required
                className={glassInput}
              />
            </div>
          </div>

          {state === "Create" && (
            <div className={glassRoleBox}>
              <Btn
                type="button"
                variant="ghost"
                onClick={() => {
                  setRole("CRAFTSMAN");
                  setFormData((prev) => ({
                    ...prev,
                    role: "CRAFTSMAN",
                  }));
                }}
                className={`${glassRoleBtn} ${
                  role === "CRAFTSMAN" ? glassRoleBtnActive : ""
                }`}
              >
                Craftsman
              </Btn>

              <Btn
                type="button"
                variant="ghost"
                onClick={() => {
                  setRole("CUSTOMER");
                  setFormData((prev) => ({
                    ...prev,
                    role: "CUSTOMER",
                  }));
                }}
                className={`${glassRoleBtn} ${
                  role === "CUSTOMER" ? glassRoleBtnActive : ""
                }`}
              >
                Customer
              </Btn>
            </div>
          )}

          {state === "Login" && (
            <Btn
              type="button"
              variant="ghost"
              onClick={() => navigate("/reset-password")}
              className={`${glassLink} mb-4 p-0 shadow-none hover:translate-y-0`}
            >
              Forgot Password?
            </Btn>
          )}

          <Btn type="submit" variant="ghost" className={glassSubmit}>
            {state === "Create" ? "Sign Up" : "Login"}
          </Btn>

          <div className={glassSwitch}>
            {state === "Create" ? (
              <>
                Already have an account?{" "}
                <Btn
                  type="button"
                  variant="ghost"
                  onClick={() => setState("Login")}
                  className={glassSwitchBtn}
                >
                  Login
                </Btn>
              </>
            ) : (
              <>
                Are you new member?{" "}
                <Btn
                  type="button"
                  variant="ghost"
                  onClick={() => setState("Create")}
                  className={glassSwitchBtn}
                >
                  Sign Up
                </Btn>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
