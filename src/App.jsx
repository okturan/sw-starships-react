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

  const resultLabel = searchTerm
    ? `${filteredStarships.length} match${filteredStarships.length === 1 ? "" : "es"}`
    : `${starships.length} vessels`;

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center min-h-screen">
        <div className="loading-panel" role="status">
          <span className="loading-orbit" aria-hidden="true" />
          <span>Contacting the archive…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-shell flex flex-col gap-4 items-center justify-center min-h-screen" role="alert">
        <p className="eyebrow">Archive connection interrupted</p>
        <h1 className="text-3xl text-white">The fleet manifest could not be loaded.</h1>
        <button type="button" className="primary-action" onClick={() => setRequestId((id) => id + 1)}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={`app-shell min-h-screen relative ${selectedStarship ? "overflow-hidden" : ""}`}>
      <div className="page-frame" aria-hidden={selectedStarship ? "true" : undefined}>
        <header className="archive-header">
          <div>
            <p className="eyebrow">Open data / fleet registry</p>
            <h1>Starship Archive</h1>
            <p className="header-copy">Search the fleet, scan its specifications, and open a complete technical record.</p>
          </div>
          <a className="source-link" href="https://swapi.dev/" target="_blank" rel="noreferrer">
            Data by SWAPI <span aria-hidden="true">↗</span>
          </a>
        </header>

        <section className="search-panel" aria-label="Search the starship archive">
          <label htmlFor="starship-search">Search by vessel name</label>
          <div className="search-row">
            <input
              id="starship-search"
              type="search"
              aria-label="Search starships by name"
              placeholder="Try Millennium Falcon or X-wing"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && <button type="button" className="clear-search" onClick={() => setSearchTerm("")}>Clear</button>}
            <output className="result-count" aria-live="polite">{resultLabel}</output>
          </div>
        </section>

        <main className="starship-grid">
          {filteredStarships.map((starship, index) => (
            <StarshipCardSideA
              key={starship.url}
              index={index + 1}
              starship={starship}
              onSelect={(event) => openStarship(starship, event.currentTarget)}
            />
          ))}
          {filteredStarships.length === 0 && (
            <div className="empty-state" role="status">
              <span aria-hidden="true">No signal</span>
              <h2>No vessels match “{searchTerm}”</h2>
              <button type="button" onClick={() => setSearchTerm("")}>Reset the search</button>
            </div>
          )}
        </main>

        <footer>
          <span>Unofficial, non-commercial learning project.</span>
          <span>Live public data from <a href="https://swapi.dev/documentation" target="_blank" rel="noreferrer">SWAPI documentation</a>.</span>
        </footer>
      </div>

      {selectedStarship && <StarshipCardSideB starship={selectedStarship} onClose={() => setSelectedStarship(null)} />}
    </div>
  );
};

export default App;
