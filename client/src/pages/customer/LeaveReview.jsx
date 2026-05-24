import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../../context/AppContext";
import Btn from "../../components/Btn";

// MUI Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ratingFields = [
  {
    name: "rating",
    label: "Overall Experience",
    description: "How satisfied were you with the whole service?",
  },
  {
    name: "qualityRating",
    label: "Work Quality",
    description: "Was the work done correctly and professionally?",
  },
  {
    name: "punctualityRating",
    label: "Time & Punctuality",
    description: "Did the craftsman arrive and finish on time?",
  },
  {
    name: "communicationRating",
    label: "Communication",
    description: "Was the craftsman clear, responsive, and helpful?",
  },
  {
    name: "professionalismRating",
    label: "Professionalism",
    description: "Was the craftsman respectful and easy to deal with?",
  },
  {
    name: "cleanlinessRating",
    label: "Cleanliness",
    description: "Did the craftsman leave the work area clean?",
  },
  {
    name: "priceFairnessRating",
    label: "Price Fairness",
    description: "Did the service feel fair for the price?",
  },
];

const issueOptions = [
  "Late arrival",
  "Poor communication",
  "Unclean work",
  "Rude behavior",
  "Incomplete work",
  "Overcharged",
  "Damaged property",
  "Excellent service",
  "Fast completion",
  "Professional behavior",
];

export default function LeaveReview() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = React.useContext(AppContext);

  const [ratings, setRatings] = React.useState({
    rating: 5,
    qualityRating: 5,
    punctualityRating: 5,
    communicationRating: 5,
    professionalismRating: 5,
    cleanlinessRating: 5,
    priceFairnessRating: 5,
  });

  const [wouldRecommend, setWouldRecommend] = React.useState(true);
  const [wouldHireAgain, setWouldHireAgain] = React.useState(true);
  const [issueTags, setIssueTags] = React.useState([]);
  const [comment, setComment] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const updateRating = (name, value) => {
    setRatings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleIssueTag = (tag) => {
    setIssueTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  const submitReview = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      const { data } = await axios.post(
        `${backendUrl}/api/user/review/${taskId}`,
        {
          ...ratings,
          wouldRecommend,
          wouldHireAgain,
          issueTags,
          comment,
        },
      );

      toast.success(data.message || "Review submitted successfully");
      navigate(`/bookings/${taskId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <Btn
          type="button"
          onClick={() => navigate(`/bookings/${taskId}`)}
          variant="outline"
          className="mb-6"
        >
          <ArrowBackIcon fontSize="small" />
          Back to booking
        </Btn>

        <section className="overflow-hidden rounded-3xl border border-border-soft bg-card-gradient shadow-card">
          <div className="relative overflow-hidden bg-primary-gradient px-6 py-10 text-white sm:px-8">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white shadow-soft">
                <RateReviewIcon sx={{ fontSize: 34 }} />
              </div>

              <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                Customer Feedback
              </p>

              <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
                Review Your Service
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                Rate different parts of your experience so the admin team can
                review service quality more precisely.
              </p>
            </div>
          </div>

          <form onSubmit={submitReview} className="space-y-8 p-5 sm:p-8">
            <section className="space-y-4">
              {ratingFields.map((field) => (
                <RatingRow
                  key={field.name}
                  label={field.label}
                  description={field.description}
                  value={ratings[field.name]}
                  onChange={(value) => updateRating(field.name, value)}
                />
              ))}
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <YesNoCard
                label="Would you recommend this craftsman?"
                value={wouldRecommend}
                onChange={setWouldRecommend}
              />

              <YesNoCard
                label="Would you hire this craftsman again?"
                value={wouldHireAgain}
                onChange={setWouldHireAgain}
              />
            </section>

            <section className="rounded-2xl border border-border-soft bg-background p-5 shadow-soft">
              <label className="mb-4 block text-sm font-bold text-primary">
                What best describes your experience?
              </label>

              <div className="flex flex-wrap gap-2">
                {issueOptions.map((tag) => {
                  const selected = issueTags.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleIssueTag(tag)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        selected
                          ? "border-transparent bg-primary-gradient text-white shadow-card"
                          : "border-border-soft bg-card-gradient text-text-muted hover:bg-background-light hover:text-primary"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-border-soft bg-background p-5 shadow-soft">
              <label className="mb-3 block text-sm font-bold text-primary">
                Additional Comment
              </label>

              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={6}
                maxLength={1000}
                placeholder="Tell us what happened during the service..."
                className="w-full resize-none rounded-2xl border border-border-soft bg-card-gradient px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              />

              <p className="mt-2 text-xs text-text-muted">
                {comment.length}/1000 characters
              </p>
            </section>

            <Btn
              type="submit"
              disabled={submitting}
              variant="primary"
              fullWidth
              className="min-h-[54px] rounded-xl"
            >
              <CheckCircleIcon fontSize="small" />
              {submitting ? "Submitting..." : "Submit Detailed Review"}
            </Btn>
          </form>
        </section>
      </div>
    </main>
  );
}

function RatingRow({ label, description, value, onChange }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-background p-4 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-bold text-text">{label}</p>
          <p className="mt-1 text-sm leading-6 text-text-muted">
            {description}
          </p>
        </div>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= value;

            return (
              <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border text-2xl shadow-soft transition-all duration-300 hover:-translate-y-0.5 ${
                  active
                    ? "border-secondary/20 bg-secondary/10 text-secondary hover:bg-secondary/20"
                    : "border-border-soft bg-card-gradient text-text-muted hover:border-secondary/30 hover:bg-secondary/10 hover:text-secondary"
                }`}
                aria-label={`${label}: ${star} stars`}
              >
                {active ? <StarIcon /> : <StarBorderIcon />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function YesNoCard({ label, value, onChange }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-background p-5 shadow-soft">
      <p className="mb-4 font-bold text-text">{label}</p>

      <div className="grid grid-cols-2 gap-3">
        <Btn
          type="button"
          onClick={() => onChange(true)}
          variant={value ? "success" : "outline"}
          className="rounded-xl"
        >
          Yes
        </Btn>

        <Btn
          type="button"
          onClick={() => onChange(false)}
          variant={!value ? "danger" : "outline"}
          className="rounded-xl"
        >
          No
        </Btn>
      </div>
    </div>
  );
}
