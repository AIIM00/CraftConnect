import * as React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

// Icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary-gradient text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[320px] w-[320px] rounded-full bg-secondary/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[320px] w-[320px] rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-container px-4 py-14 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          {/* Brand */}
          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
            <Link to="/#header" className="inline-block">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-card">
                  <img
                    src={assets.logo}
                    alt="CraftConnect logo"
                    className="h-9 w-9 object-contain"
                  />
                </div>

                <div>
                  <h2 className="font-heading text-2xl font-bold">
                    CraftConnect
                  </h2>

                  <p className="mt-1 text-sm text-white/70">
                    Trusted craftsmen marketplace
                  </p>
                </div>
              </div>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/75">
              Connect with reliable craftsmen, book trusted services, and get
              everyday tasks done with confidence.
            </p>

            {/* Social */}
            <div className="mt-8">
              <p className="mb-4 text-sm font-semibold text-white/80">
                Follow us
              </p>

              <div className="flex items-center gap-3">
                {[
                  {
                    icon: FacebookIcon,
                  },
                  {
                    icon: InstagramIcon,
                  },
                  {
                    icon: MusicNoteIcon,
                  },
                ].map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={index}
                      className="
                        flex h-11 w-11 items-center justify-center
                        rounded-xl
                        border border-white/10
                        bg-white/10
                        text-white
                        backdrop-blur-md
                        transition duration-300
                        hover:-translate-y-1
                        hover:border-secondary/30
                        hover:bg-secondary/20
                        hover:text-secondary-soft
                      "
                    >
                      <Icon fontSize="small" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Discover */}
          <FooterCard
            title="Discover"
            links={[
              {
                label: "Become a Craftsman",
                path: "/login",
              },
              {
                label: "Browse Services",
                path: "/services",
              },
              {
                label: "How It Works",
                path: "/#howItWorks",
              },
            ]}
          />

          {/* Company */}
          <FooterCard
            title="Company"
            links={[
              {
                label: "About Us",
                path: "/about",
              },
              {
                label: "Terms & Privacy",
                path: "/terms-privacy",
              },
            ]}
          />
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CraftConnect. All rights reserved.</p>
          <p className="text-sm text-text-muted">
            Designed and developed by
            <span className="font-semibold text-secondary"> ali & mohamad</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCard({ title, links }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
      <h3 className="mb-5 font-heading text-lg font-bold text-secondary">
        {title}
      </h3>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.path}
              className="
                group
                flex items-center justify-between
                rounded-xl
                border border-transparent
                px-3 py-3
                text-sm font-medium text-white/75
                transition duration-300
                hover:border-white/10
                hover:bg-white/10
                hover:text-white
              "
            >
              <span>{link.label}</span>

              <ArrowOutwardIcon
                fontSize="small"
                className="translate-x-0 opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
