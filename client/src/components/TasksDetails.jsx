import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import NotesIcon from "@mui/icons-material/Notes";

import { AppContext } from "../context/AppContext";
import Btn from "./Btn";

const TasksDetails = ({
  task,
  onClose,
  onAction,
  onComplete,
  actionLoading,
  scheduledDate,
  onScheduledDateChange,
}) => {
  const { statusStyles } = React.useContext(AppContext);

  return (
    <div className="overflow-hidden rounded-2xl border border-border-soft bg-background shadow-card">
      <div className="relative overflow-hidden bg-primary-gradient px-5 py-6 text-white sm:px-6">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-secondary/25 blur-3xl" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Task Details
            </p>

            <h3 className="mt-2 font-heading text-2xl font-bold leading-tight">
              {task.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        <InfoBlock label="Status">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
              statusStyles[task.status] || "bg-background-light text-text-muted"
            }`}
          >
            {task.status}
          </span>
        </InfoBlock>

        <InfoBlock label="Service" icon={<HandymanOutlined fontSize="small" />}>
          <p className="text-sm font-semibold text-text">
            {task.service?.name || "No service"}
          </p>
        </InfoBlock>

        <InfoBlock label="Description" icon={<NotesIcon fontSize="small" />}>
          <p className="text-sm leading-6 text-text-muted">
            {task.description || "No description provided."}
          </p>
        </InfoBlock>

        <InfoBlock label="Location" icon={<LocationOnIcon fontSize="small" />}>
          <p className="text-sm font-medium text-text">
            {task.location || "No location"}
          </p>
        </InfoBlock>

        <InfoBlock label="Customer" icon={<PersonIcon fontSize="small" />}>
          <p className="font-semibold text-text">
            {task.customer?.name || "Unknown customer"}
          </p>

          <p className="mt-1 text-sm text-text-muted">
            {task.customer?.email || "No email"}
          </p>

          <p className="mt-1 text-sm text-text-muted">
            {task.customer?.phoneNumber || "No phone number"}
          </p>
        </InfoBlock>

        <InfoBlock label="Time" icon={<AccessTimeIcon fontSize="small" />}>
          <p className="text-sm font-medium text-text">
            {task.assignedAt || task.createdAt || "N/A"}
          </p>
        </InfoBlock>

        {task.status === "PENDING" && (
          <div className="space-y-4 rounded-2xl border border-border-soft bg-card-gradient p-4 shadow-soft">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-secondary">
                Schedule Visit
              </span>

              <input
                type="datetime-local"
                value={scheduledDate}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(event) => onScheduledDateChange(event.target.value)}
                className="w-full rounded-xl border border-border-soft bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <a
                href={`tel:${task.customer?.phoneNumber || ""}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-soft bg-background px-4 py-3 text-sm font-semibold text-primary shadow-soft transition hover:bg-background-light"
              >
                <PhoneIcon fontSize="small" />
                Call
              </a>

              <Btn
                type="button"
                variant="success"
                disabled={actionLoading || !scheduledDate}
                onClick={() => onAction(task.taskId, "ACCEPT", scheduledDate)}
                className="rounded-xl"
              >
                <CheckCircleIcon fontSize="small" />
                Accept
              </Btn>

              <Btn
                type="button"
                variant="danger"
                disabled={actionLoading}
                onClick={() => onAction(task.taskId, "REJECT")}
                className="rounded-xl"
              >
                <CancelIcon fontSize="small" />
                Decline
              </Btn>
            </div>
          </div>
        )}

        {task.status === "IN_PROGRESS" && (
          <div className="space-y-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div>
              <p className="text-sm font-bold text-primary">
                This task is currently in progress.
              </p>
              <p className="mt-1 text-sm text-text-muted">
                When the work is finished, mark this task as completed.
              </p>
            </div>

            {onComplete && (
              <Btn
                type="button"
                variant="success"
                disabled={actionLoading}
                fullWidth
                onClick={() => onComplete(task.taskId)}
              >
                <CheckCircleIcon fontSize="small" />
                {actionLoading ? "Completing..." : "Mark as Completed"}
              </Btn>
            )}
          </div>
        )}

        {task.status === "COMPLETED" && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-bold text-success">
              This task has been completed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

function InfoBlock({ label, icon, children }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-card-gradient p-4 shadow-soft">
      <div className="mb-2 flex items-center gap-2 text-secondary">
        {icon}
        <p className="text-xs font-bold uppercase tracking-[0.16em]">{label}</p>
      </div>

      {children}
    </div>
  );
}

export default TasksDetails;
