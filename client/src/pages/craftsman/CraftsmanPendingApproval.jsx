import * as React from "react";

import { AppContext } from "../../context/AppContext";

//Components
import Btn from "../../components/Btn";

//MUI Icons
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LogoutIcon from "@mui/icons-material/Logout";

const CraftsmanPendingApproval = () => {
  const { logout } = React.useContext(AppContext);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 text-text">
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

        <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-6">
          <HourglassEmptyIcon sx={{ fontSize: 44 }} />
        </div>

        <h1 className="text-3xl font-extrabold text-primary mb-3">
          Account Pending Approval
        </h1>

        <p className="text-text-muted leading-relaxed mb-6">
          Your craftsman account has been created successfully, but it has not
          been approved by the admin yet.
        </p>

        <div className="bg-bg rounded-2xl p-5 text-left mb-8">
          <p className="font-bold text-text mb-2">What happens next?</p>
          <p className="text-sm text-text-muted leading-relaxed">
            Please wait until an admin reviews and approves your account. Once
            approved, you will be able to access your craftsman dashboard,
            manage tasks, view earnings, and update your schedule.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CraftsmanPendingApproval;
