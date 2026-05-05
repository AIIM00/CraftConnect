import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Services() {
  const { backendUrl } = useContext(AppContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/services`);

      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      {loading ? (
        <p className="text-text-muted">Loading services...</p>
      ) : categories.length === 0 ? (
        <p className="text-text-muted">No services available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(`/services/${category.id}`)}
              className="group bg-surface border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition" />

                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition">
                  <ArrowForwardIcon fontSize="small" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-primary mb-3">
                {category.name}
              </h3>

              <div className="flex flex-wrap gap-2">
                {category.services.map((service) => (
                  <span
                    key={service.id}
                    className="text-xs bg-bg border border-gray-200 rounded-full px-3 py-1 text-text-muted group-hover:border-primary/20"
                  >
                    {service.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
