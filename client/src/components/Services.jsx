import { useNavigate } from "react-router-dom";
import * as React from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

import Btn from "./Btn";
import { toast } from "react-toastify";

// MUI Icons
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import HandymanIcon from "@mui/icons-material/Handyman";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import HardwareIcon from "@mui/icons-material/Hardware";
import YardIcon from "@mui/icons-material/Yard";
import MemoryIcon from "@mui/icons-material/Memory";
import BuildIcon from "@mui/icons-material/Build";

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
      <div className="rounded-2xl border border-border-soft bg-card-gradient p-8 text-center text-text-muted shadow-soft">
        Loading services...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-soft bg-card-gradient p-10 text-center text-text-muted shadow-soft">
        No services available yet.
      </div>
    );
  }

  const displayedCategories = limit ? categories.slice(0, limit) : categories;
  const categoryIcons = {
    "Cleaning Services": CleaningServicesIcon,

    "Craft Services": ArchitectureIcon,

    "Finishing Services": HandymanIcon,

    "Home Repair Services": HomeRepairServiceIcon,

    "Installation Services": SettingsSuggestIcon,

    "Metal Services": HardwareIcon,

    "Outdoor Services": YardIcon,

    "Technology Services": MemoryIcon,
  };
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {displayedCategories.map((category) => {
        const isFlipped = flippedCategoryId === category.id;
        const Icon = categoryIcons[category.name] || BuildIcon;
        return (
          <div key={category.id} className="h-[340px] [perspective:1400px]">
            <div
              className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              {/* Front */}
              <div
                className={`absolute inset-0 overflow-hidden rounded-2xl border border-border-soft bg-card-gradient p-6 shadow-soft [backface-visibility:hidden] ${
                  isFlipped ? "pointer-events-none" : "pointer-events-auto"
                }`}
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-secondary/10 blur-2xl" />

                <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-5 flex items-start justify-between">
                    <div
                      className="
                        flex h-14 w-14 items-center justify-center
                        rounded-2xl
                        bg-primary-gradient
                        text-white
                        shadow-card
                      "
                    >
                      {(() => {
                        const Icon = categoryIcons[category.name] || BuildIcon;
                        return <Icon />;
                      })()}
                    </div>

                    <Btn
                      type="button"
                      variant="surface"
                      iconOnly
                      onClick={() => {
                        setFlippedCategoryId(category.id);
                        setSelectedService(null);
                      }}
                      className="
                        border-border-soft
                        hover:border-secondary/30
                      "
                      aria-label={`View ${category.name} services`}
                    >
                      <ArrowForwardIosOutlinedIcon fontSize="small" />{" "}
                    </Btn>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                      Category
                    </p>

                    <h3 className="font-heading text-2xl font-bold leading-tight text-primary">
                      {category.name}
                    </h3>

                    <p className=" text-sm leading-7 text-text-muted">
                      Browse available services and choose the right one for
                      your task.
                    </p>
                  </div>

                  <div className="mt-auto flex max-h-[76px] flex-wrap gap-2 overflow-hidden py-2">
                    {category.services.slice(0, 3).map((service) => (
                      <span
                        key={service.id}
                        className="max-w-full truncate rounded-full border border-border-soft bg-background px-2 py-1 text-xs font-semibold text-text-muted"
                      >
                        {service.name}
                      </span>
                    ))}

                    {category.services.length > 3 && (
                      <span className="rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1.5 text-xs font-semibold text-secondary">
                        +{category.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Back */}
              <div
                className={`absolute inset-0 overflow-hidden rounded-2xl border border-border-soft bg-primary-gradient p-6 text-white shadow-card [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                  isFlipped ? "pointer-events-auto" : "pointer-events-none"
                }`}
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-secondary/20 blur-2xl" />

                <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-3 flex items-start justify-between mx-1">
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary-soft">
                        Select Service
                      </p>

                      <h3 className="font-heading text-xl font-bold">
                        {category.name}
                      </h3>
                    </div>

                    <Btn
                      type="button"
                      variant="ghost"
                      iconOnly
                      onClick={() => {
                        setFlippedCategoryId(null);
                        setSelectedService(null);
                      }}
                      className="
                      px-5
                        bg-white/10
                        text-white
                        hover:bg-white/20
                        hover:cursor-pointer
                      "
                      aria-label="Close services list"
                    >
                      <CloseOutlinedIcon fontSize="small" />
                    </Btn>
                  </div>

                  <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                    {category.services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setSelectedService(service)}
                        className={`
                          w-full rounded-xl border px-4 py-3
                          text-left text-sm font-semibold
                          transition-all duration-300
                          ${
                            selectedService?.id === service.id
                              ? `
                                border-white/40
                                bg-secondary-gradient
                                text-white
                                shadow-card
                              `
                              : `
                                border-white/10
                                bg-white/10
                                text-white/80
                                hover:border-white/20
                                hover:bg-white/15
                                hover:text-white
                              `
                          }
                        `}
                      >
                        {service.name}
                      </button>
                    ))}
                  </div>

                  <Btn
                    type="button"
                    variant="secondary"
                    onClick={() => handleBook(category)}
                    className="mt-5 min-h-[52px] w-full"
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
