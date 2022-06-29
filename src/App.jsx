import { useEffect, useState } from 'react';
import './App.scss';

const footConversion = 0.3280839895;
const poundConversion = 0.220462;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function App() {
  const [results, setResults] = useState([]);
  const [viewExtraDetailsId, setViewExtraDetailsId] = useState(-1);

  useEffect(() => {
    const promises = [];
    const speciesPromises = [];
    for (let i = 1; i <= 18; i++) {
      const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
      const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${i}/`;
      promises.push(fetch(url).then((res) => res.json()));
      speciesPromises.push(fetch(speciesUrl).then((res) => res.json()));
    }
    Promise.all(promises).then((pokemonResults) => {
      Promise.all(speciesPromises).then((speciesResults) => {
        for (const result of pokemonResults) {
          const res = speciesResults.find((sr) => sr.id === result.id);
          const genus = res.genera.find((g) => g.language.name === 'en').genus;
          result.species.genus = genus;
        }
        console.log(pokemonResults)
        setResults(pokemonResults);
      });
    });
  }, []);

  return (
    <div className="container">
      <div className="title">
        PokeAPI Pokedex
      </div>

      <div className="results-grid">
        {results.length && results.map((result, i) => (
          <div className="result" key={i}>
            <div className="result-inner">
              <div className="result-image-container">
                <img className="result-image" src={result.sprites.front_default} alt={result.name} />
              </div>
              <div className="result-content">
                <div className="result-title">
                  <div className="result-number">
                    No. {result.id}
                  </div>
                  <div className="result-name">
                    {capitalizeFirstLetter(result.name)}
                  </div>
                </div>
                <div className="result-detail-grid">
                  <div className="result-detail-species">
                    {result.species.genus}
                  </div>
                  <div className="result-detail-row">
                    <div className="result-detail-column result-detail-header">
                      Height
                    </div>
                    <div className="result-detail-column result-detail-value">
                      {Math.floor((result.height * footConversion) * 10) / 10} ft.
                    </div>
                  </div>
                  <div className="result-detail-row">
                    <div className="result-detail-column result-detail-header">
                      Weight
                    </div>
                    <div className="result-detail-column result-detail-value">
                      {Math.floor((result.weight * poundConversion) * 10) / 10} lbs.
                    </div>
                  </div>
                  <div className="result-detail-row">
                    <div className="result-detail-column result-detail-header">
                      Type
                    </div>
                    <div className="result-detail-column result-detail-value">
                      {result.types.map(t => capitalizeFirstLetter(t.type.name)).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {viewExtraDetailsId === result.id && (
              <div className="extra-details">
                <div className="extra-details-column">
                  <div className="extra-details-row">
                    <div className="extra-details-column extra-details-header">HP</div>
                    <div className="extra-details-column extra-details-value">{result.stats.find((s) => s.stat.name === 'hp').base_stat}</div>
                  </div>
                  <div className="extra-details-row">
                    <div className="extra-details-column extra-details-header">Attack</div>
                    <div className="extra-details-column extra-details-value">{result.stats.find((s) => s.stat.name === 'attack').base_stat}</div>
                  </div>
                  <div className="extra-details-row">
                    <div className="extra-details-column extra-details-header">Defense</div>
                    <div className="extra-details-column extra-details-value">{result.stats.find((s) => s.stat.name === 'defense').base_stat}</div>
                  </div>
                </div>
                <div className="extra-details-column">
                  <div className="extra-details-row">
                    <div className="extra-details-column extra-details-header">Speed</div>
                    <div className="extra-details-column extra-details-value">{result.stats.find((s) => s.stat.name === 'speed').base_stat}</div>
                  </div>
                  <div className="extra-details-row">
                    <div className="extra-details-column extra-details-header">Sp. Attack</div>
                    <div className="extra-details-column extra-details-value">{result.stats.find((s) => s.stat.name === 'special-attack').base_stat}</div>
                  </div>
                  <div className="extra-details-row">
                    <div className="extra-details-column extra-details-header">Sp. Defense</div>
                    <div className="extra-details-column extra-details-value">{result.stats.find((s) => s.stat.name === 'special-defense').base_stat}</div>
                  </div>
                </div>
              </div>
            ) }
            <div className="see-more" onClick={() => setViewExtraDetailsId(viewExtraDetailsId === result.id ? -1 : result.id)}>
              See {viewExtraDetailsId === result.id ? 'Less' : 'More'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;