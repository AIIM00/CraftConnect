// src/pages/TermsPrivacy.jsx

import { useNavigate } from "react-router-dom";
import Btn from "../components/Btn";

import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import GavelIcon from "@mui/icons-material/Gavel";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

export default function TermsPrivacy() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-8 lg:px-16 bg-[radial-gradient(circle_at_72%_18%,rgba(218,165,32,0.28),transparent_28%),radial-gradient(circle_at_18%_84%,rgba(0,128,128,0.26),transparent_30%),linear-gradient(135deg,#133A63_0%,#0B2540_48%,#008080_100%)]">
      <div className="pointer-events-none absolute -right-32 -top-36 h-[540px] w-[540px] rotate-[26deg] rounded-[42%] bg-[linear-gradient(135deg,rgba(169,209,232,0.55),rgba(218,165,32,0.24),rgba(255,255,255,0.12))] opacity-65" />
      <div className="pointer-events-none absolute -bottom-44 -left-36 h-[540px] w-[540px] rotate-[-24deg] rounded-[42%] bg-[linear-gradient(135deg,rgba(0,128,128,0.5),rgba(169,209,232,0.25),rgba(255,255,255,0.12))] opacity-65" />

      <section className="relative z-10 mx-auto w-full max-w-5xl rounded-[36px] border border-white/40 bg-[linear-gradient(145deg,rgba(255,255,255,0.19),rgba(255,255,255,0.08))] p-6 text-text-light shadow-[0_25px_70px_rgba(19,58,99,0.26),inset_0_0_45px_rgba(255,255,255,0.06)] backdrop-blur-[22px] sm:p-10 lg:p-14">
        <div className="mb-8 flex items-center justify-between">
          <Btn
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="h-[46px] w-[46px] rounded-full border border-white/40 bg-white/10 p-0 text-text-light shadow-none transition hover:bg-accent hover:text-primary-dark hover:shadow-[0_0_32px_rgba(218,165,32,0.32)]"
            aria-label="Go back"
          >
            <KeyboardArrowLeftIcon sx={{ fontSize: 30 }} />
          </Btn>

          <Btn
            type="button"
            variant="ghost"
            onClick={() => navigate("/")}
            className="h-[46px] w-[46px] rounded-full border border-white/40 bg-white/10 p-0 text-text-light shadow-none transition hover:bg-accent hover:text-primary-dark hover:shadow-[0_0_32px_rgba(218,165,32,0.32)]"
            aria-label="Go home"
          >
            <HomeFilledIcon sx={{ fontSize: 26 }} />
          </Btn>
        </div>

        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[rgba(247,244,237,0.55)] bg-[linear-gradient(135deg,#A9D1E8,#DAA520)] text-primary-dark shadow-[0_0_32px_rgba(218,165,32,0.32)]">
          <GavelIcon sx={{ fontSize: 54 }} />
        </div>

        <p className="mb-3 text-center text-sm font-bold tracking-[0.18em] text-accent-soft">
          CRAFTCONNECT
        </p>

        <h1 className="mb-4 text-center font-heading text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-[1px] text-text-light [text-shadow:0_0_18px_rgba(218,165,32,0.28)]">
          Terms & Privacy
        </h1>

        <p className="mx-auto mb-10 max-w-3xl text-center text-sm leading-7 text-[rgba(247,244,237,0.76)] sm:text-base">
          Please read these terms and privacy guidelines carefully before using
          CraftConnect. By using our platform, you agree to these conditions.
        </p>

        <div className="space-y-8">
          <div className="rounded-[28px] border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/20 text-accent-soft">
                <GavelIcon />
              </div>

              <h2 className="font-heading text-2xl font-extrabold text-text-light">
                Terms of Service
              </h2>
            </div>

            <div className="space-y-5 text-sm leading-7 text-[rgba(247,244,237,0.76)]">
              <div>
                <h3 className="mb-1 font-display text-base font-bold text-accent-soft">
                  1. Use of CraftConnect
                </h3>
                <p>
                  CraftConnect connects customers with craftsmen and service
                  providers. Users agree to provide accurate information, use
                  the platform responsibly, and avoid any fraudulent or harmful
                  activity.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-display text-base font-bold text-accent-soft">
                  2. User Accounts
                </h3>
                <p>
                  You are responsible for keeping your account information and
                  password secure. You must notify us if you believe your
                  account has been accessed without permission.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-display text-base font-bold text-accent-soft">
                  3. Craftsman Services
                </h3>
                <p>
                  Craftsmen are responsible for the quality, timing, and
                  completion of the services they provide. Customers should
                  review service details before confirming any task.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-display text-base font-bold text-accent-soft">
                  4. Payments and Bookings
                </h3>
                <p>
                  Any booking, pricing, cancellation, or payment terms should be
                  clearly shown before a task is confirmed. CraftConnect may
                  update these rules as the platform grows.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-display text-base font-bold text-accent-soft">
                  5. Prohibited Activity
                </h3>
                <p>
                  Users may not misuse the platform, post false information,
                  harass others, attempt unauthorized access, or use
                  CraftConnect for illegal purposes.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/25 text-primary-light">
                <ShieldOutlinedIcon />
              </div>

              <h2 className="font-heading text-2xl font-extrabold text-text-light">
                Privacy Policy
              </h2>
            </div>

            <div className="space-y-5 text-sm leading-7 text-[rgba(247,244,237,0.76)]">
              <div>
                <h3 className="mb-1 font-display text-base font-bold text-accent-soft">
                  1. Information We Collect
                </h3>
                <p>
                  We may collect your name, email address, phone number, role,
                  profile details, task details, location information, and other
                  information needed to provide our services.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-display text-base font-bold text-accent-soft">
                  2. How We Use Your Information
                </h3>
                <p>
                  We use your information to create your account, match
                  customers with craftsmen, manage bookings, improve the
                  platform, send verification codes, and protect users from
                  misuse.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-display text-base font-bold text-accent-soft">
                  3. Location Data
                </h3>
                <p>
                  Location data may be used to help customers find nearby
                  craftsmen and to support accurate task addresses. You should
                  only provide location details that you are comfortable sharing
                  for service purposes.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-display text-base font-bold text-accent-soft">
                  4. Data Protection
                </h3>
                <p>
                  We take reasonable steps to protect user information. However,
                  no online platform can guarantee complete security, so users
                  should also protect their account credentials.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-display text-base font-bold text-accent-soft">
                  5. Updates to This Policy
                </h3>
                <p>
                  We may update these Terms & Privacy rules from time to time.
                  Continued use of CraftConnect after updates means you accept
                  the revised terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
