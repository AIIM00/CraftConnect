import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { AppContext } from "../context/AppContext";

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
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-bold text-primary">Task Details</p>
          <h3 className="text-xl font-extrabold text-text mt-1">
            {task.title}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-bg text-text-muted hover:bg-gray-200 transition flex items-center justify-center"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>

      <div className="space-y-4">
        <InfoBlock label="Status">
          <span
            className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
              statusStyles[task.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {task.status}
          </span>
        </InfoBlock>

        <InfoBlock label="Service">
          <p className="text-sm text-text">
            {task.service?.name || "No service"}
          </p>
        </InfoBlock>

        <InfoBlock label="Description">
          <p className="text-sm text-text leading-6">
            {task.description || "No description provided."}
          </p>
        </InfoBlock>

        <InfoBlock label="Location">
          <p className="text-sm text-text flex items-center gap-2">
            <LocationOnIcon fontSize="small" />
            {task.location}
          </p>
        </InfoBlock>

        <InfoBlock label="Customer">
          <p className="font-bold text-text">
            {task.customer?.name || "Unknown customer"}
          </p>

          <p className="text-sm text-text-muted mt-1">
            {task.customer?.email || "No email"}
          </p>

          <p className="text-sm text-text-muted mt-1">
            {task.customer?.phoneNumber || "No phone number"}
          </p>
        </InfoBlock>

        <InfoBlock label="Time">
          <p className="text-sm text-text flex items-center gap-2">
            <AccessTimeIcon fontSize="small" />
            {task.assignedAt || task.createdAt || "N/A"}
          </p>
        </InfoBlock>

        {task.status === "PENDING" && (
          <div className="space-y-3 pt-2">
            <label className="block">
              <span className="block text-xs font-bold text-text-muted uppercase mb-2">
                Schedule visit
              </span>
              <input
                type="datetime-local"
                value={scheduledDate}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(event) => onScheduledDateChange(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-text outline-none focus:border-primary"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={`tel:${task.customer?.phoneNumber || ""}`}
                className="text-center py-3 rounded-2xl bg-bg text-primary font-bold hover:bg-primary hover:text-white transition flex items-center justify-center gap-2"
              >
                <PhoneIcon fontSize="small" />
                Call
              </a>

              <button
                type="button"
                disabled={actionLoading || !scheduledDate}
                onClick={() => onAction(task.taskId, "ACCEPT", scheduledDate)}
                className="py-3 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <CheckCircleIcon fontSize="small" />
                Accept
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => onAction(task.taskId, "REJECT")}
                className="py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <CancelIcon fontSize="small" />
                Decline
              </button>
            </div>
          </div>
        )}

        {task.status === "IN_PROGRESS" && (
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <p className="text-sm font-bold text-blue-700">
                This task is currently in progress.
              </p>
              <p className="text-sm text-blue-700 mt-1">
                When the work is finished, mark this task as completed.
              </p>
            </div>
            {onComplete && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => onComplete(task.taskId)}
                className="w-full py-3 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <CheckCircleIcon fontSize="small" />
                {actionLoading ? "Completing..." : "Mark as Completed"}
              </button>
            )}
          </div>
        )}

        {task.status === "COMPLETED" && (
          <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
            <p className="text-sm font-bold text-green-700">
              This task has been completed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
function InfoBlock({ label, children }) {
  return (
    <div className="p-4 rounded-2xl bg-bg">
      <p className="text-xs font-bold text-text-muted uppercase mb-2">
        {label}
      </p>
      {children}
    </div>
  );
}

export default TasksDetails;
