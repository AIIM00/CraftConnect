import * as React from "react";

import { AppContext } from "../../context/AppContext";
import Btn from "../../components/Btn";

// MUI Icons
import BlockIcon from "@mui/icons-material/Block";
import LogoutIcon from "@mui/icons-material/Logout";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

const CraftsmanSuspended = () => {
  const { logout } = React.useContext(AppContext);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-20 h-72 w-72 rounded-full bg-danger/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center justify-center">
        <section className="w-full overflow-hidden rounded-3xl border border-border-soft bg-card-gradient shadow-card">
          <div className="relative overflow-hidden bg-primary-gradient px-6 py-8 text-white sm:px-8">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-danger/25 blur-3xl" />

            <div className="relative z-10 flex justify-end">
              <Btn
                type="button"
                onClick={() => logout("/")}
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
                <BlockIcon sx={{ fontSize: 44 }} />
              </div>

              <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-danger">
                Account Status
              </p>

              <h1 className="font-heading text-3xl font-bold sm:text-4xl">
                Account Suspended
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/80">
                Your craftsman account has been suspended. You cannot access the
                dashboard, accept tasks, update availability, or manage your
                craftsman profile right now.
              </p>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-8">
            <div className="rounded-3xl border border-danger/20 bg-danger/10 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-danger text-white shadow-soft">
                  <ShieldOutlinedIcon />
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-danger">
                    Access Temporarily Restricted
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-text-muted">
                    This restriction was applied by the admin team. Your account
                    may be restored after review if the suspension was a mistake
                    or the issue is resolved.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border-soft bg-background p-5 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
                  <SupportAgentIcon />
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-primary">
                    What should you do?
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-text-muted">
                    Please contact support or wait for the admin team to review
                    your account. If this was a mistake, an admin can restore
                    your access.
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

export default CraftsmanSuspended;
