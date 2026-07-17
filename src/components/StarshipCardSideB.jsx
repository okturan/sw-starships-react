import { useEffect, useRef } from "react";

import InfoItem from "./InfoItem";

const StarshipCardSideB = ({ starship, onClose }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const infoData = [
    { icon: "🚀", label: "Max atmospheric speed", value: `${starship.max_atmosphering_speed} km/h` },
    { icon: "👥", label: "Crew", value: starship.crew },
    { icon: "🧑‍🤝‍🧑", label: "Passengers", value: starship.passengers },
    { icon: "📦", label: "Cargo Capacity", value: `${starship.cargo_capacity} kg` },
    { icon: "🍽️", label: "Consumables", value: starship.consumables },
    { icon: "⚡", label: "Hyperdrive Rating", value: starship.hyperdrive_rating },
    { icon: "📡", label: "MGLT", value: starship.MGLT },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="starship-dialog-title"
        className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-xl rounded-xl p-8 max-w-lg w-full relative">
        <button
          ref={closeButtonRef}
          type="button"
          className="absolute top-4 right-4 text-white hover:text-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-300 text-2xl"
          onClick={onClose}
          aria-label="Close starship details">
          &times;
        </button>

        <h2 id="starship-dialog-title" className="text-3xl font-bold mb-6 text-center">{starship.name}</h2>
        <div className="space-y-4">
          {infoData.map((item) => (
            <InfoItem key={item.label} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StarshipCardSideB;
