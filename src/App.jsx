import { useEffect, useState } from "react";
import { fetchStarships } from "./utils/api";
import StarshipCardSideA from "./components/StarshipCardSideA";
import StarshipCardSideB from "./components/StarshipCardSideB";

const App = () => {
  const [starships, setStarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedStarship, setSelectedStarship] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getStarships = async () => {
      try {
        const data = await fetchStarships();
        setStarships(data);
      } catch (err) {
        console.error("Error fetching starships:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getStarships();
  }, []);

  const filteredStarships = starships.filter((starship) =>
    starship.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-red-500">Failed to load starships.</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-r from-yellow-900 via-blue-900 to-black
 p-12 relative ${selectedStarship ? "overflow-hidden" : ""}`}>
      <header className="text-center mb-8">
        <h1 className="text-7xl mb-8 text-white font-bold">Star Wars Starships</h1>
        <input
          type="text"
          placeholder="Search starships..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-8 py-2 mb-8 rounded border border-gray-300 bg-slate-200"
        />
      </header>
      <main className={`grid gap-8 grid-cols-[repeat(auto-fit,minmax(37ch,1fr))] ${selectedStarship ? "blur-sm" : ""}`}>
        {filteredStarships.map((starship) => (
          <StarshipCardSideA key={starship.url} starship={starship} onSelect={() => setSelectedStarship(starship)} />
        ))}
      </main>

      {selectedStarship && <StarshipCardSideB starship={selectedStarship} onClose={() => setSelectedStarship(null)} />}
    </div>
  );
};

export default App;
