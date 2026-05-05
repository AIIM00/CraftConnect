import * as React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

// Icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-1 gap-10">
        {/* Brand + Social */}
        <Link to="/#header">
          <div>
            <div className="flex items-center gap-3 mb-4 cursor-pointer">
              <img src={assets.logo} alt="logo" className="w-12" />
              <h2 className="text-xl font-bold">CraftConnect</h2>
            </div>

            <p className="text-white/70 text-sm mb-4">
              Your trusted marketplace for services.
            </p>
            <div className="flex items-center gap-3">
              <p className="font-semibold mb-0">Follow us! We're friendly:</p>

              <div className="flex gap-4">
                <FacebookIcon className="cursor-pointer hover:text-accent transition" />
                <InstagramIcon className="cursor-pointer hover:text-accent transition" />
                <MusicNoteIcon className="cursor-pointer hover:text-accent transition" />
              </div>
            </div>
          </div>
        </Link>
        <div className="grid grid-cols-3 gap-10">
          {/* Discover */}
          <div>
            <h3 className="font-semibold mb-4">Discover</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="hover:text-white cursor-pointer">
                Become a Tasker
              </li>
              <li className="hover:text-white cursor-pointer">
                Services By City
              </li>
              <li className="hover:text-white cursor-pointer">
                Services Nearby
              </li>
              <li className="hover:text-white cursor-pointer">All Services</li>
            </ul>
          </div>

          {/* Company + Help */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">
                Partner with CraftConnect
              </li>
              <li className="hover:text-white cursor-pointer">Help</li>
              <li className="hover:text-white cursor-pointer">
                Terms & Privacy
              </li>
            </ul>
          </div>

          {/* App Download */}
          <div>
            <h3 className="font-semibold mb-4">Download our app</h3>
            <p className="text-sm text-white/70 mb-4">
              Tackle your to-do list wherever you are with our mobile app.
            </p>

            <div className="space-y-3">
              <button className="w-full bg-white text-primary py-2 rounded-xl font-medium hover:bg-gray-200 transition">
                Apple Store
              </button>
              <button className="w-full bg-accent py-2 rounded-xl font-medium hover:bg-accent-hover transition">
                Google Play
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 text-center text-sm text-white/60 py-2">
          © {new Date().getFullYear()} CraftConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
