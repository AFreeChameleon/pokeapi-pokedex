import React, { useEffect, useState } from 'react';
import './App.scss';

type Stat = {
  base_stat: number;
  stat: {
    name: string;
  };
};

type Result = {
  name: string;
  id: number;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  species: {
    genus?: string;
  }
  stats: Stat[];
  types: {
    type: {
      name: string;
    }
  }[];
};

type SpeciesResult = {
  id: number;
  genera: { language: { name: string; }; genus: string; }[];
};

const footConversion = 0.3280839895;
const poundConversion = 0.220462;

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getStat(stats: Stat[], key: string) {
  const stat = stats.find((s) => s.stat.name === key);
  return stat ? stat.base_stat : 'N/A';
}

function App() {
  const [results, setResults] = useState<Result[]>([]);
  const [viewExtraDetailsId, setViewExtraDetailsId] = useState<Number>(-1);

  useEffect(() => {
    const promises: Promise<Result>[] = [];
    const speciesPromises: Promise<SpeciesResult>[] = [];
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
          if (!res) {
            continue;
          }
          const genera = res.genera.find((g) => g.language.name === 'en');
          result.species.genus = !genera ? 'Default Pokémon' : genera.genus;
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
        {results.length ? results.map((result, i) => (
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
                    <div className="extra-details-column extra-details-value">{getStat(result.stats, 'hp')}</div>
                  </div>
                  <div className="extra-details-row">
                    <div className="extra-details-column extra-details-header">Attack</div>
                    <div className="extra-details-column extra-details-value">{getStat(result.stats, 'attack')}</div>
                  </div>
                  <div className="extra-details-row">
                    <div className="extra-details-column extra-details-header">Defense</div>
                    <div className="extra-details-column extra-details-value">{getStat(result.stats, 'defense')}</div>
                  </div>
                </div>
                <div className="extra-details-column">
                  <div className="extra-details-row">
                    <div className="extra-details-column extra-details-header">Speed</div>
                    <div className="extra-details-column extra-details-value">{getStat(result.stats, 'speed')}</div>
                  </div>
                  <div className="extra-details-row">
                    <div className="extra-details-column extra-details-header">Sp. Attack</div>
                    <div className="extra-details-column extra-details-value">{getStat(result.stats, 'special-attack')}</div>
                  </div>
                  <div className="extra-details-row">
                    <div className="extra-details-column extra-details-header">Sp. Defense</div>
                    <div className="extra-details-column extra-details-value">{getStat(result.stats, 'special-defense')}</div>
                  </div>
                </div>
              </div>
            ) }
            <div className="see-more" onClick={() => setViewExtraDetailsId(viewExtraDetailsId === result.id ? -1 : result.id)}>
              See {viewExtraDetailsId === result.id ? 'Less' : 'More'}
            </div>
          </div>
        )) : null}
      </div>
    </div>
  );
}

export default App;