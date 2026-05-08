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
    return <p className="text-text-muted">Loading services...</p>;
  }
  if (categories.length === 0) {
    return <p className="text-text-muted">No services available yet.</p>;
  }
  const displayedCategories = limit ? categories.slice(0, limit) : categories;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayedCategories.map((category) => {
        const isFlipped = flippedCategoryId === category.id;
        return (
          <div key={category.id} className="h-80 perspective">
            <div
              className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/*Front*/}
              <div className="absolute inset-0 backface-hidden bg-surface border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center " />
                  <button
                    type="button"
                    onClick={() => {
                      setFlippedCategoryId(category.id);
                      setSelectedService(null);
                    }}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-accent hover:text-white transition"
                  >
                    <ArrowForwardIcon fontSize="small" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-primary mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-text-muted mb-3">
                  Click to view available services.
                </p>

                <div className="flex flex-wrap gap-2">
                  {category.services.slice(0, 4).map((service) => (
                    <span
                      key={service.id}
                      className="text-xs bg-bg border border-gray-200 rounded-full px-1 py-1 text-text-muted group-hover:border-primary/20"
                    >
                      {service.name}
                    </span>
                  ))}
                </div>
              </div>
              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-surface border border-gray-100 rounded-3xl p-8 shadow-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-primary">
                    {category.name}
                  </h3>

                  <button
                    type="button"
                    onClick={() => {
                      setFlippedCategoryId(null);
                      setSelectedService(null);
                    }}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                </div>

                <p className="text-sm  text-text-muted mb-2">
                  Choose a service:
                </p>

                <div className="m-2 space-y-2 h-1/2 overflow-y-auto pr-1">
                  {category.services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service)}
                      className={`w-full text-left text-sm px-4 py-2 rounded-xl border transition ${
                        selectedService?.id === service.id
                          ? "bg-primary text-white border-primary"
                          : "bg-bg text-text-muted border-gray-200 hover:border-primary"
                      }`}
                    >
                      {service.name}
                    </button>
                  ))}
                </div>

                <Btn
                  type="button"
                  onClick={() => handleBook(category)}
                  className="w-full bg-accent text-white font-bold hover:bg-accent-hover transition"
                >
                  Book Service
                </Btn>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
