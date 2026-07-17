import { useEffect, useRef } from "react";

import InfoItem from "./InfoItem";

const StarshipCardSideB = ({ starship, onClose }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const infoData = [
    { label: "Max atmospheric speed", value: `${starship.max_atmosphering_speed} km/h` },
    { label: "Crew", value: starship.crew },
    { label: "Passengers", value: starship.passengers },
    { label: "Cargo capacity", value: `${starship.cargo_capacity} kg` },
    { label: "Consumables", value: starship.consumables },
    { label: "Hyperdrive rating", value: starship.hyperdrive_rating },
    { label: "MGLT", value: starship.MGLT },
  ];

  return (
    <div
      className="dialog-backdrop"
      onClick={handleOverlayClick}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="starship-dialog-title"
        className="dialog-panel">
        <p className="eyebrow">Technical record</p>
        <button
          ref={closeButtonRef}
          type="button"
          className="dialog-close"
          onClick={onClose}
          aria-label="Close starship details">
          &times;
        </button>

        <h2 id="starship-dialog-title">{starship.name}</h2>
        <p className="dialog-model">{starship.model}</p>
        <div className="dialog-data">
          {infoData.map((item) => (
            <InfoItem key={item.label} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StarshipCardSideB;
