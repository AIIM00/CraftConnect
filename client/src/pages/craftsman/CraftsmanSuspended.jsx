import * as React from "react";

import { AppContext } from "../../context/AppContext";
//Components
import Btn from "../../components/Btn";
//MUI Icons
import BlockIcon from "@mui/icons-material/Block";
import LogoutIcon from "@mui/icons-material/Logout";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const CraftsmanSuspended = () => {
  const { logout } = React.useContext(AppContext);

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center">
          <div className="w-full flex justify-end">
            <Btn
              type="button"
              onClick={() => logout("/")}
              variant="danger"
              className="m-2 h-11 w-11 rounded-full p-0"
            >
              <LogoutIcon />
            </Btn>
          </div>
          <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6">
            <BlockIcon sx={{ fontSize: 44 }} />
          </div>

          <h1 className="text-3xl font-extrabold text-primary mb-3">
            Account Suspended
          </h1>

          <p className="text-text-muted leading-relaxed mb-6">
            Your craftsman account has been suspended. You cannot access the
            craftsman dashboard, accept tasks, update your availability, or
            manage your craftsman profile at this time.
          </p>

          <div className="bg-bg rounded-2xl p-5 text-left mb-8">
            <div className="flex items-start gap-3">
              <SupportAgentIcon className="text-primary mt-1" />
              <div>
                <p className="font-bold text-text mb-2">What should you do?</p>
                <p className="text-sm text-text-muted leading-relaxed">
                  Please contact support or wait for the admin team to review
                  your account. If this was a mistake, the admin can restore
                  your access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CraftsmanSuspended;
