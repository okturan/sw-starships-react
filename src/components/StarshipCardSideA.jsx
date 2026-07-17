import InfoItem from "./InfoItem";

const StarshipCardSideA = ({ starship, onSelect, index }) => {
  const creditValue = Number(starship.cost_in_credits);
  const formattedCost = Number.isFinite(creditValue)
    ? `${creditValue.toLocaleString("en-US")} credits`
    : starship.cost_in_credits;
  const infoData = [
    { label: "Model", value: starship.model },
    { label: "Class", value: starship.starship_class },
    { label: "Cost", value: formattedCost },
    { label: "Length", value: `${starship.length} m` },
  ];

  return (
    <button
      type="button"
      className="starship-card"
      aria-label={`View details for ${starship.name}`}
      onClick={onSelect}>
      <div className="card-heading">
        <span className="record-number">{String(index).padStart(2, "0")}</span>
        <span className="open-record">Open record <span aria-hidden="true">↗</span></span>
      </div>
      <h2>{starship.name}</h2>
      <div className="card-data">
        {infoData.map((item) => (
          <InfoItem key={item.label} icon={item.icon} label={item.label} value={item.value} />
        ))}
      </div>
    </button>
  );
};

export default StarshipCardSideA;
