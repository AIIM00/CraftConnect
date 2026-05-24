import { useNavigate } from "react-router-dom";
import Btn from "../components/Btn";

import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import GavelIcon from "@mui/icons-material/Gavel";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";

export default function TermsPrivacy() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background-dark bg-hero-gradient px-0 py-0 sm:px-4 sm:py-8">
      <section className="mx-auto max-w-container overflow-hidden rounded-none border-0 bg-background shadow-none sm:rounded-2xl sm:border sm:border-border-soft sm:shadow-glass">
        <div className="relative overflow-hidden bg-primary-gradient px-5 py-8 text-white sm:px-10 sm:py-12 lg:px-14">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />

          <div className="relative z-10 mb-10 flex items-center justify-between">
            <Btn
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 p-0 text-white shadow-soft transition hover:bg-white/20"
              aria-label="Go back"
            >
              <KeyboardArrowLeftIcon sx={{ fontSize: 30 }} />
            </Btn>

            <Btn
              type="button"
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 p-0 text-white shadow-soft transition hover:bg-white/20"
              aria-label="Go home"
            >
              <HomeFilledIcon sx={{ fontSize: 26 }} />
            </Btn>
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
              <GavelIcon fontSize="small" />
              <span className="text-sm font-semibold">CraftConnect Policy</span>
            </div>

            <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Terms & Privacy
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Please read these terms and privacy guidelines carefully before
              using CraftConnect. By using our platform, you agree to these
              conditions.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-8 lg:p-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <PolicyCard
              icon={<GavelIcon />}
              title="Terms of Service"
              items={[
                {
                  title: "Use of CraftConnect",
                  text: "CraftConnect connects customers with craftsmen and service providers. Users agree to provide accurate information, use the platform responsibly, and avoid fraudulent or harmful activity.",
                },
                {
                  title: "User Accounts",
                  text: "You are responsible for keeping your account information and password secure. You must notify us if you believe your account has been accessed without permission.",
                },
                {
                  title: "Craftsman Services",
                  text: "Craftsmen are responsible for the quality, timing, and completion of the services they provide. Customers should review service details before confirming any task.",
                },
                {
                  title: "Payments and Bookings",
                  text: "Any booking, pricing, cancellation, or payment terms should be clearly shown before a task is confirmed. CraftConnect may update these rules as the platform grows.",
                },
                {
                  title: "Prohibited Activity",
                  text: "Users may not misuse the platform, post false information, harass others, attempt unauthorized access, or use CraftConnect for illegal purposes.",
                },
              ]}
            />

            <PolicyCard
              icon={<ShieldOutlinedIcon />}
              title="Privacy Policy"
              items={[
                {
                  title: "Information We Collect",
                  text: "We may collect your name, email address, phone number, role, profile details, task details, location information, and other information needed to provide our services.",
                },
                {
                  title: "How We Use Your Information",
                  text: "We use your information to create your account, match customers with craftsmen, manage bookings, improve the platform, send verification codes, and protect users from misuse.",
                },
                {
                  title: "Location Data",
                  text: "Location data may be used to help customers find nearby craftsmen and support accurate task addresses. Only provide location details you are comfortable sharing for service purposes.",
                },
                {
                  title: "Data Protection",
                  text: "We take reasonable steps to protect user information. However, no online platform can guarantee complete security, so users should also protect their account credentials.",
                },
                {
                  title: "Updates to This Policy",
                  text: "We may update these Terms & Privacy rules from time to time. Continued use of CraftConnect after updates means you accept the revised terms.",
                },
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function PolicyCard({ icon, title, items }) {
  return (
    <article className="rounded-2xl border border-border-soft bg-card-gradient p-5 shadow-soft sm:p-7">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card">
          {icon}
        </div>

        <h2 className="font-heading text-2xl font-semibold text-primary">
          {title}
        </h2>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.title}
            className="rounded-xl border border-border-soft bg-background p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <VerifiedIcon className="text-secondary" fontSize="small" />

              <h3 className="font-semibold text-text">
                {index + 1}. {item.title}
              </h3>
            </div>

            <p className="text-sm leading-7 text-text-muted">{item.text}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
