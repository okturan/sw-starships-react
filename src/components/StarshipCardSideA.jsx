import InfoItem from "./InfoItem";

const StarshipCardSideA = ({ starship, onSelect }) => {
  const creditValue = Number(starship.cost_in_credits);
  const formattedCost = Number.isFinite(creditValue)
    ? `${creditValue.toLocaleString("en-US")} credits`
    : starship.cost_in_credits;
  const infoData = [
    { icon: "📦", label: "Model", value: starship.model },
    { icon: "⚖️", label: "Class", value: starship.starship_class },
    { icon: "💰", label: "Cost", value: formattedCost },
    { icon: "📏", label: "Length", value: `${starship.length} m` },
  ];

  return (
    <button
      type="button"
      className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white text-left shadow-md rounded-xl p-6 flex flex-col cursor-pointer hover:scale-105 hover:shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-yellow-300 transition-transform duration-300"
      aria-label={`View details for ${starship.name}`}
      onClick={onSelect}>
      <h2 className="text-2xl font-bold mb-4 text-center">{starship.name}</h2>
      <div className="flex flex-col space-y-2 flex-1">
        {infoData.map((item) => (
          <InfoItem key={item.label} icon={item.icon} label={item.label} value={item.value} />
        ))}
      </div>
    </button>
  );
};

export default StarshipCardSideA;
