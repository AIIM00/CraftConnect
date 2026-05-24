import * as React from "react";

import { AppContext } from "../../context/AppContext";

// Components
import Btn from "../../components/Btn";

// MUI Icons
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LogoutIcon from "@mui/icons-material/Logout";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const CraftsmanPendingApproval = () => {
  const { logout } = React.useContext(AppContext);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-28 bottom-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center justify-center">
        <section className="w-full overflow-hidden rounded-3xl border border-border-soft bg-card-gradient shadow-card">
          {/* HERO */}
          <div className="relative overflow-hidden bg-primary-gradient px-6 py-8 text-white sm:px-8">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative z-10 flex justify-end">
              <Btn
                type="button"
                onClick={async () => logout("/")}
                variant="danger"
                iconOnly
                aria-label="Logout"
                className="border-white/15 bg-white/10 text-white hover:bg-danger"
              >
                <LogoutIcon fontSize="small" />
              </Btn>
            </div>

            <div className="relative z-10 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-white shadow-card">
                <HourglassEmptyIcon sx={{ fontSize: 44 }} />
              </div>

              <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                Account Status
              </p>

              <h1 className="font-heading text-3xl font-bold sm:text-4xl">
                Pending Approval
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/80">
                Your craftsman account was created successfully and is currently
                waiting for admin approval.
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="space-y-5 p-5 sm:p-8">
            <div className="rounded-3xl border border-secondary/20 bg-secondary/10 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-white shadow-soft">
                  <VerifiedUserIcon />
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-secondary">
                    Verification In Progress
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-text-muted">
                    Your application is currently being reviewed by the admin
                    team to ensure quality and trust across the platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border-soft bg-background p-5 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
                  <AdminPanelSettingsIcon />
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-primary">
                    What happens next?
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-text-muted">
                    Once approved, you will gain full access to your craftsman
                    dashboard where you can manage tasks, update your
                    availability, track reviews, and organize your schedule.
                  </p>
                </div>
              </div>
            </div>

            <Btn
              type="button"
              onClick={async () => logout("/")}
              variant="outline"
              fullWidth
              className="rounded-xl"
            >
              <LogoutIcon fontSize="small" />
              Logout
            </Btn>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CraftsmanPendingApproval;
