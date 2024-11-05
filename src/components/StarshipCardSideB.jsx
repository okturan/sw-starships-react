import React from "react";

import InfoItem from "./InfoItem";

const StarshipCardSideB = ({ starship, onClose }) => {
  // Handle clicks on the overlay to close the modal when clicking outside the card
  const handleOverlayClick = (e) => {
    if (e.target.id === "overlay") {
      onClose();
    }
  };

  const infoData = [
    { icon: "🚀", label: "Max Atmosphering Speed", value: `${starship.max_atmosphering_speed} km/h` },
    { icon: "👥", label: "Crew", value: starship.crew },
    { icon: "🧑‍🤝‍🧑", label: "Passengers", value: starship.passengers },
    { icon: "📦", label: "Cargo Capacity", value: `${starship.cargo_capacity} kg` },
    { icon: "🍽️", label: "Consumables", value: starship.consumables },
    { icon: "⚡", label: "Hyperdrive Rating", value: starship.hyperdrive_rating },
    { icon: "📡", label: "MGLT", value: starship.MGLT },
  ];

  return (
    <div
      id="overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}>
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-xl rounded-xl p-8 max-w-lg w-full relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
          onClick={onClose}
          aria-label="Close">
          &times;
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">{starship.name}</h2>
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
