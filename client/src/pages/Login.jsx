import * as React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { assets } from "../assets/assets";

import { toast } from "react-toastify";

//Components
import { AppContext } from "../context/AppContext";
import Btn from "../components/Btn";

//MUI Components
import Box from "@mui/material/Box";

//MUI Icons
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import VerifiedIcon from "@mui/icons-material/Verified";
import HandymanIcon from "@mui/icons-material/Handyman";
import GroupsIcon from "@mui/icons-material/Groups";

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } =
    React.useContext(AppContext);

  const [state, setState] = React.useState("Login");
  const [role, setRole] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const isCreate = state === "Create";

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
    setRole("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isCreate) {
        if (!formData.role) {
          toast.error("Please select your role");
          return;
        }

        const { data } = await axios.post(
          `${backendUrl}/api/auth/register`,
          formData,
        );

        if (!data.success) {
          toast.error(data.message || "Failed to create account");
          return;
        }

        toast.success(data.message || "Account created successfully");
        setState("Login");
        resetForm();
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

      toast.success(data.message || "Welcome back!");

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
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-background-dark px-4 py-2 ">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-container grid-cols-1 overflow-hidden rounded-2xl border border-border-soft bg-transparent shadow-glass lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="relative hidden overflow-hidden bg-primary-gradient p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />

          <div className="relative z-10">
            <Box
              onClick={() => navigate("/")}
              className="group flex items-center gap-3 cursor-pointer shrink-0"
            >
              <Box className="flex h-18 w-18 items-center justify-center rounded-2xl bg-white/10 border border-white/15 shadow-sm transition group-hover:border-accent/70 group-hover:bg-white/15">
                <Box
                  component="img"
                  src={assets.logo}
                  alt="CraftConnect logo"
                  className="h-15 w-14 object-contain"
                />
              </Box>

              <Box className="leading-tight">
                <h1 className="font-display text-lg sm:text-2xl font-extrabold tracking-wide text-text-light">
                  Craft<span className="text-secondary">Connect</span>
                </h1>

                <p className="hidden sm:block text-sm font-medium tracking-wide text-text-muted">
                  Service Marketplace Platform
                </p>
              </Box>
            </Box>

            <h1 className="max-w-xl font-heading text-5xl font-bold leading-tight">
              Connect with trusted craftsmen faster.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-white/80">
              A modern platform for customers to find skilled workers and for
              craftsmen to grow their business.
            </p>
          </div>

          <div className="relative z-10 grid gap-4">
            {[
              "Verified craftsmen profiles",
              "Fast customer requests",
              "Simple dashboard experience",
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

        <main className="relative flex items-center justify-center bg-transparent lg:bg-background p-0 lg:p-12">
          <div className="relative z-10 w-full max-w-md py-4">
            <div className="rounded-2xl border border-border-soft bg-card-gradient p-6 shadow-card sm:p-8">
              <div className=" flex md:items-center justify-between ">
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
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
                  {isCreate ? (
                    <PersonIcon sx={{ fontSize: 44 }} />
                  ) : (
                    <LockIcon sx={{ fontSize: 44 }} />
                  )}
                </div>

                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-secondary">
                  {isCreate ? "Join CraftConnect" : "Welcome Back"}
                </p>

                <h2 className="font-heading text-3xl font-bold text-primary">
                  {isCreate ? "Create Account" : "Login to Account"}
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-text-muted">
                  {isCreate
                    ? "Create your account and start using CraftConnect today."
                    : "Access your dashboard and continue where you left off."}
                </p>
              </div>

              <form onSubmit={onSubmitHandler} className="space-y-5">
                {isCreate && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text">
                      Full Name
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-background px-4 py-3.5 text-text-muted shadow-soft transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
                      <PersonIcon fontSize="small" />
                      <input
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        type="text"
                        placeholder="Enter your full name"
                        required
                        className="w-full bg-transparent text-text outline-none placeholder:text-text-muted"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text">
                    Email Address
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-background px-4 py-3.5 text-text-muted shadow-soft transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
                    <MailIcon fontSize="small" />
                    <input
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="w-full bg-transparent text-text outline-none placeholder:text-text-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text">
                    Password
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-background px-4 py-3.5 text-text-muted shadow-soft transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
                    <LockIcon fontSize="small" />
                    <input
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      type="password"
                      placeholder="Enter your password"
                      required
                      className="w-full bg-transparent text-text outline-none placeholder:text-text-muted"
                    />
                  </div>
                </div>

                {isCreate && (
                  <div className="grid grid-cols-2 gap-3 rounded-xl border border-border-soft bg-background-light p-3">
                    {[
                      {
                        value: "CRAFTSMAN",
                        label: "Craftsman",
                        icon: HandymanIcon,
                      },
                      {
                        value: "CUSTOMER",
                        label: "Customer",
                        icon: GroupsIcon,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      const active = role === item.value;

                      return (
                        <Btn
                          key={item.value}
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setRole(item.value);
                            updateField("role", item.value);
                          }}
                          className={`flex flex-col items-center rounded-lg px-4 py-7 text-sm font-semibold transition ${
                            active
                              ? "bg-primary-gradient text-white shadow-card"
                              : "bg-background text-text hover:bg-background-dark hover:text-primary"
                          }`}
                        >
                          <Icon fontSize="small" />
                          {item.label}
                        </Btn>
                      );
                    })}
                  </div>
                )}

                {!isCreate && (
                  <div className="flex justify-end">
                    <Btn
                      type="button"
                      variant="ghost"
                      onClick={() => navigate("/reset-password")}
                      className="p-0 text-sm font-semibold text-secondary shadow-none hover:translate-y-0 hover:text-secondary-hover"
                    >
                      Forgot Password?
                    </Btn>
                  </div>
                )}

                <Btn
                  type="submit"
                  variant="ghost"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-primary-gradient px-6 py-4 text-base font-semibold text-white shadow-card transition duration-300 hover:scale-[1.01] hover:shadow-elevated disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? isCreate
                      ? "Creating Account..."
                      : "Logging in..."
                    : isCreate
                      ? "Create Account"
                      : "Login"}
                </Btn>

                <div className="pt-2 text-center text-sm text-text-muted">
                  {isCreate ? (
                    <>
                      Already have an account?{" "}
                      <Btn
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setState("Login");
                          resetForm();
                        }}
                        className="p-0 ml-1 font-semibold text-secondary shadow-none hover:translate-y-0 hover:text-secondary-hover"
                      >
                        Login
                      </Btn>
                    </>
                  ) : (
                    <>
                      New to CraftConnect?{" "}
                      <Btn
                        type="button"
                        variant="ghost"
                        onClick={() => setState("Create")}
                        className="p-0 ml-1  font-semibold text-secondary shadow-none hover:translate-y-0 hover:text-secondary-hover"
                      >
                        Create Account
                      </Btn>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Login;
