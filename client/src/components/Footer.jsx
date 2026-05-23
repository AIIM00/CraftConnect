import * as React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

// Icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[radial-gradient(circle_at_12%_20%,rgba(218,165,32,0.18),transparent_28%),radial-gradient(circle_at_88%_80%,rgba(0,128,128,0.22),transparent_30%),linear-gradient(135deg,#0B2540_0%,#133A63_52%,#0B2540_100%)] text-text-light">
      <div className="pointer-events-none absolute -left-32 -top-32 h-[360px] w-[360px] rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-[360px] w-[360px] rounded-full bg-teal/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_2fr]">
          {/* Brand + Social */}
          <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-[0_25px_70px_rgba(19,58,99,0.22),inset_0_0_35px_rgba(255,255,255,0.05)] backdrop-blur-xl">
            <Link to="/#header" className="inline-block">
              <div className="mb-4 flex cursor-pointer items-center gap-3">
                <img
                  src={assets.logo}
                  alt="CraftConnect logo"
                  className="w-12 rounded-2xl"
                />

                <h2 className="font-heading text-2xl font-extrabold tracking-[0.5px] text-text-light">
                  CraftConnect
                </h2>
              </div>
            </Link>

            <p className="mb-6 max-w-sm text-sm leading-6 text-[rgba(247,244,237,0.7)]">
              Your trusted marketplace for reliable craftsmen and everyday
              services.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className="mb-0 text-sm font-semibold text-[rgba(247,244,237,0.82)]">
                Follow us! We&apos;re friendly:
              </p>

              <div className="flex gap-3">
                <FacebookIcon className="cursor-pointer rounded-full border border-white/15 bg-white/10 p-1 text-[34px] transition hover:border-accent/50 hover:bg-accent/20 hover:text-accent-soft" />
                <InstagramIcon className="cursor-pointer rounded-full border border-white/15 bg-white/10 p-1 text-[34px] transition hover:border-accent/50 hover:bg-accent/20 hover:text-accent-soft" />
                <MusicNoteIcon className="cursor-pointer rounded-full border border-white/15 bg-white/10 p-1 text-[34px] transition hover:border-accent/50 hover:bg-accent/20 hover:text-accent-soft" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Discover */}
            <div className="rounded-[24px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
              <h3 className="mb-4 font-display text-base font-bold text-accent-soft">
                Discover
              </h3>

              <ul className="space-y-3 text-sm text-[rgba(247,244,237,0.7)]">
                <li>
                  <Link
                    to="/login"
                    className="block cursor-pointer transition hover:translate-x-1 hover:text-text-light"
                  >
                    Become a Tasker
                  </Link>
                </li>

                <li>
                  <Link
                    to="/services"
                    className="block cursor-pointer transition hover:translate-x-1 hover:text-text-light"
                  >
                    All Services
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company + Help */}
            <div className="rounded-[24px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
              <h3 className="mb-4 font-display text-base font-bold text-accent-soft">
                Company
              </h3>

              <ul className="space-y-3 text-sm text-[rgba(247,244,237,0.7)]">
                <li>
                  <Link
                    to="/about"
                    className="cursor-pointer transition hover:translate-x-1 hover:text-text-light"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-privacy"
                    className="cursor-pointer transition hover:translate-x-1 hover:text-text-light"
                  >
                    Terms & Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-[rgba(247,244,237,0.58)]">
          © {new Date().getFullYear()} CraftConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
