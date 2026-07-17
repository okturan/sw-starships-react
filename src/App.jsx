import { useEffect, useRef, useState } from "react";
import { fetchStarships } from "./utils/api";
import StarshipCardSideA from "./components/StarshipCardSideA";
import StarshipCardSideB from "./components/StarshipCardSideB";

const App = () => {
  const [starships, setStarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedStarship, setSelectedStarship] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [requestId, setRequestId] = useState(0);
  const lastTriggerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    const getStarships = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await fetchStarships({ signal: controller.signal });
        setStarships(data);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching starships:", err);
        setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    getStarships();
    return () => controller.abort();
  }, [requestId]);

  useEffect(() => {
    if (!selectedStarship) lastTriggerRef.current?.focus();
  }, [selectedStarship]);

  const openStarship = (starship, trigger) => {
    lastTriggerRef.current = trigger;
    setSelectedStarship(starship);
  };

  const filteredStarships = starships.filter((starship) =>
    starship.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl" role="status">Loading starships...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center min-h-screen" role="alert">
        <p className="text-2xl text-red-500">Failed to load starships.</p>
        <button type="button" className="rounded bg-blue-800 px-5 py-2 text-white" onClick={() => setRequestId((id) => id + 1)}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-r from-yellow-900 via-blue-900 to-black
 p-12 relative ${selectedStarship ? "overflow-hidden" : ""}`}>
      <header className="text-center mb-8" aria-hidden={selectedStarship ? "true" : undefined}>
        <h1 className="text-7xl mb-8 text-white font-bold">Star Wars Starships</h1>
        <input
          type="text"
          aria-label="Search starships by name"
          placeholder="Search starships..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-8 py-2 mb-8 rounded border border-gray-300 bg-slate-200"
        />
      </header>
      <main
        aria-hidden={selectedStarship ? "true" : undefined}
        className={`grid gap-8 grid-cols-[repeat(auto-fit,minmax(37ch,1fr))] ${selectedStarship ? "blur-sm" : ""}`}>
        {filteredStarships.map((starship) => (
          <StarshipCardSideA
            key={starship.url}
            starship={starship}
            onSelect={(event) => openStarship(starship, event.currentTarget)}
          />
        ))}
        {filteredStarships.length === 0 && <p className="text-center text-xl text-white" role="status">No starships match “{searchTerm}”.</p>}
      </main>

      {selectedStarship && <StarshipCardSideB starship={selectedStarship} onClose={() => setSelectedStarship(null)} />}
    </div>
  );
};

export default App;
