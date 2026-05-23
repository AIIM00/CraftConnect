import { useNavigate } from "react-router-dom";
import * as React from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

import Btn from "./Btn";
import { toast } from "react-toastify";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";

export default function Services({ limit }) {
  const { backendUrl } = React.useContext(AppContext);

  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [flippedCategoryId, setFlippedCategoryId] = React.useState(null);
  const [selectedService, setSelectedService] = React.useState(null);

  const navigate = useNavigate();

  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/services`);

      if (data.success) {
        setCategories(data.categories);
      } else {
        toast.error(data.message || "Failed to load services");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getCategories();
  }, []);

  const handleBook = (category) => {
    if (!selectedService) {
      toast.error("Please choose a service first");
      return;
    }

    navigate("/post-task", {
      state: {
        categoryId: category.id,
        categoryName: category.name,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
      },
    });
  };

  if (loading) {
    return (
      <div className="rounded-[24px] border border-white/50 bg-white/45 p-6 text-center text-text-muted shadow-soft backdrop-blur-xl">
        Loading services...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-primary/20 bg-white/45 p-8 text-center text-text-muted shadow-soft backdrop-blur-xl">
        No services available yet.
      </div>
    );
  }

  const displayedCategories = limit ? categories.slice(0, limit) : categories;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {displayedCategories.map((category) => {
        const isFlipped = flippedCategoryId === category.id;

        return (
          <div key={category.id} className="h-[330px] [perspective:1200px]">
            <div
              className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              {/* Front */}
              <div className="absolute inset-0 overflow-hidden rounded-[30px] border border-white/60 bg-[linear-gradient(145deg,rgba(255,255,255,0.72),rgba(247,244,237,0.55))] p-6 shadow-[0_18px_45px_rgba(19,58,99,0.12),inset_0_0_35px_rgba(255,255,255,0.45)] backdrop-blur-xl transition-all duration-300 [backface-visibility:hidden] hover:-translate-y-1 hover:border-accent/40 hover:bg-white/75 hover:shadow-[0_25px_60px_rgba(19,58,99,0.18)]">
                <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-accent/20 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-14 -left-14 h-36 w-36 rounded-full bg-teal/15 blur-2xl" />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(247,244,237,0.55)] bg-[linear-gradient(135deg,#A9D1E8_0%,#DAA520_100%)] shadow-[0_0_24px_rgba(218,165,32,0.25)]">
                      <span className="h-5 w-5 rounded-full bg-primary-dark shadow-inner" />
                    </div>

                    <Btn
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setFlippedCategoryId(category.id);
                        setSelectedService(null);
                      }}
                      className="h-10 w-10 rounded-full border border-white/50 bg-primary/90 p-0 text-text-light shadow-[0_10px_24px_rgba(19,58,99,0.22)] transition hover:translate-x-1 hover:bg-accent hover:text-primary-dark"
                      aria-label={`View ${category.name} services`}
                    >
                      <ArrowForwardIcon fontSize="small" />
                    </Btn>
                  </div>

                  <h3 className="mb-2 font-heading text-2xl font-extrabold leading-tight text-primary">
                    {category.name}
                  </h3>

                  <p className="mb-4 text-sm leading-6 text-text-muted">
                    Click to view available services.
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2">
                    {category.services.slice(0, 4).map((service) => (
                      <span
                        key={service.id}
                        className="rounded-full border border-primary/10 bg-white/55 px-3 py-1 text-xs font-semibold text-text-muted backdrop-blur-md"
                      >
                        {service.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 overflow-hidden rounded-[30px] border border-white/60 bg-[linear-gradient(145deg,rgba(19,58,99,0.94),rgba(11,37,64,0.9))] p-6 text-text-light shadow-[0_25px_60px_rgba(19,58,99,0.22),inset_0_0_35px_rgba(255,255,255,0.06)] backdrop-blur-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-accent/25 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-14 -left-14 h-36 w-36 rounded-full bg-teal/25 blur-2xl" />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-2xl font-extrabold leading-tight text-text-light">
                        {category.name}
                      </h3>

                      <p className="mt-1 text-sm text-[rgba(247,244,237,0.68)]">
                        Choose a service:
                      </p>
                    </div>

                    <Btn
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setFlippedCategoryId(null);
                        setSelectedService(null);
                      }}
                      className="h-9 w-9 rounded-full border border-white/15 bg-white/10 p-0 text-text-light shadow-none transition hover:bg-error/35 hover:text-white"
                      aria-label="Close services list"
                    >
                      <CloseIcon fontSize="small" />
                    </Btn>
                  </div>

                  <div className="mb-4 mt-2 flex-1 space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(218,165,32,0.55)_transparent]">
                    {category.services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setSelectedService(service)}
                        className={`w-full rounded-2xl border px-4 py-2.5 text-left text-sm font-bold transition-all duration-300 ${
                          selectedService?.id === service.id
                            ? "border-[rgba(247,244,237,0.65)] bg-gold-gradient text-surface shadow-[0_10px_22px_rgba(218,165,32,0.25)]"
                            : "border-white/15 bg-white/10 text-[rgba(247,244,237,0.78)] hover:border-accent/50 hover:bg-white/15 hover:text-text-light"
                        }`}
                      >
                        {service.name}
                      </button>
                    ))}
                  </div>

                  <Btn
                    type="button"
                    variant="ghost"
                    onClick={() => handleBook(category)}
                    className="min-h-[50px] w-full rounded-full border border-[rgba(247,244,237,0.55)] bg-gold-gradient px-5 font-extrabold text-primary-dark shadow-[0_14px_30px_rgba(218,165,32,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(218,165,32,0.38)]"
                  >
                    Book Service
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
