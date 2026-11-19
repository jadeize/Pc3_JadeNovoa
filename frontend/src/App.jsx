import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [universities, setUniversities] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Consumir la API del backend una sola vez
  useEffect(() => {
    fetch("/api/search?country=Peru")
    
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar los datos");
        return res.json();
      })
      .then((data) => setUniversities(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Búsqueda en tiempo real: se filtra con cada letra que se escribe
  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return universities.filter((u) => u.name.toLowerCase().includes(term));
  }, [universities, search]);

  return (
    <div className="container">
      <h1>🎓 Universidades del Perú</h1>

      <input
        type="text"
        className="search"
        placeholder="Buscar universidad..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="info">Cargando...</p>}
      {error && <p className="info error">{error}</p>}

      {!loading && !error && (
        <>
          <p className="info">
            Mostrando {filtered.length} de {universities.length} universidades
          </p>

          <div className="grid">
            {filtered.map((u, index) => (
              <div className="card" key={`${u.name}-${index}`}>
                <h3>{u.name}</h3>
                <p>
                  <strong>País:</strong> {u.country} ({u.alpha_two_code})
                </p>
                {u.web_pages?.[0] && (
                  <a href={u.web_pages[0]} target="_blank" rel="noreferrer">
                    {u.web_pages[0]}
                  </a>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="info">No se encontraron resultados.</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
