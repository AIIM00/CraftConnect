import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

import Btn from "../../components/Btn";
//MUI Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const ratingFields = [
  {
    name: "rating",
    label: "Overall experience",
    description: "How satisfied were you with the whole service?",
  },
  {
    name: "qualityRating",
    label: "Work quality",
    description: "Was the work done correctly and professionally?",
  },
  {
    name: "punctualityRating",
    label: "Time and punctuality",
    description: "Did the craftsman arrive and finish on time?",
  },
  {
    name: "communicationRating",
    label: "Communication",
    description: "Was the craftsman clear, responsive, and helpful?",
  },
  {
    name: "professionalismRating",
    label: "Personality and professionalism",
    description: "Was the craftsman respectful and easy to deal with?",
  },
  {
    name: "cleanlinessRating",
    label: "Cleanliness",
    description: "Did the craftsman leave the work area clean?",
  },
  {
    name: "priceFairnessRating",
    label: "Price fairness",
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
    <div className="max-w-3xl mx-auto">
      <Btn
        type="button"
        onClick={() => navigate(`/bookings/${taskId}`)}
        variant="ghost"
        className="mb-6 px-0 py-0 font-bold hover:underline"
      >
        <ArrowBackIcon fontSize="small" />
        Back to booking
      </Btn>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <p className="text-sm font-semibold text-primary-light mb-2">
          Customer Feedback
        </p>

        <h1 className="text-3xl font-extrabold text-primary">
          Review Your Service
        </h1>

        <p className="text-text-muted mt-2">
          Rate different parts of your experience so the admin team can review
          service quality more precisely.
        </p>

        <form onSubmit={submitReview} className="mt-8 space-y-8">
          <div className="space-y-5">
            {ratingFields.map((field) => (
              <RatingRow
                key={field.name}
                label={field.label}
                description={field.description}
                value={ratings[field.name]}
                onChange={(value) => updateRating(field.name, value)}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <div>
            <label className="block text-sm font-bold text-text mb-3">
              What best describes your experience?
            </label>

            <div className="flex flex-wrap gap-2">
              {issueOptions.map((tag) => {
                const selected = issueTags.includes(tag);

                return (
                  <Btn
                    key={tag}
                    type="button"
                    onClick={() => toggleIssueTag(tag)}
                    variant={selected ? "primary" : "outline"}
                    className="rounded-full px-4 py-2 text-sm font-bold"
                  >
                    {tag}
                  </Btn>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-text mb-3">
              Additional comment
            </label>

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={6}
              maxLength={1000}
              placeholder="Tell us what happened during the service..."
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-text outline-none focus:border-primary resize-none"
            />

            <p className="text-xs text-text-muted mt-2">
              {comment.length}/1000 characters
            </p>
          </div>

          <Btn
            type="submit"
            disabled={submitting}
            variant="primary"
            className="w-full rounded-2xl py-3 font-bold disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Detailed Review"}
          </Btn>
        </form>
      </section>
    </div>
  );
}

function RatingRow({ label, description, value, onChange }) {
  return (
    <div className="p-4 rounded-2xl bg-bg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="font-bold text-text">{label}</p>
          <p className="text-sm text-text-muted mt-1">{description}</p>
        </div>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= value;

            return (
              <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border text-3xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${
                  active
                    ? "border-yellow-200 bg-yellow-50 text-yellow-500 hover:bg-yellow-100"
                    : "border-gray-200 bg-white text-gray-300 hover:border-yellow-200 hover:bg-yellow-50 hover:text-yellow-400"
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
    <div className="p-4 rounded-2xl bg-bg">
      <p className="font-bold text-text mb-3">{label}</p>

      <div className="grid grid-cols-2 gap-2">
        <Btn
          type="button"
          onClick={() => onChange(true)}
          variant={value ? "success" : "secondary"}
          className="rounded-xl py-2 font-bold"
        >
          Yes
        </Btn>

        <Btn
          type="button"
          onClick={() => onChange(false)}
          variant={!value ? "danger" : "secondary"}
          className="rounded-xl py-2 font-bold"
        >
          No
        </Btn>
      </div>
    </div>
  );
}
