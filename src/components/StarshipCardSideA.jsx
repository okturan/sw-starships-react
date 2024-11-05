import InfoItem from "./InfoItem";

const StarshipCardSideA = ({ starship, onSelect }) => {
  const infoData = [
    { icon: "📦", label: "Model", value: starship.model },
    { icon: "⚖️", label: "Class", value: starship.starship_class },
    { icon: "💰", label: "Cost", value: `₹${Number(starship.cost_in_credits).toLocaleString("tr-TR")}` },
    { icon: "📏", label: "Length", value: `${starship.length} m` },
  ];

  return (
    <div
      className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-md rounded-xl p-6 flex flex-col cursor-pointer hover:scale-105 hover:shadow-lg transition-transform duration-300"
      onClick={onSelect}>
      <h2 className="text-2xl font-bold mb-4 text-center">{starship.name}</h2>
      <div className="flex flex-col space-y-2 flex-1">
        {infoData.map((item) => (
          <InfoItem key={item.label} icon={item.icon} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
};

export default StarshipCardSideA;
