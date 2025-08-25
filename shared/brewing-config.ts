// Konfigurasjon for brygging-etiketter og tekster
// Kan senere enkelt endres til å hente fra API

export interface BrewingLabels {
  brewKettle: {
    title: string;
    temperature: string;
    maltTemperature: string;
    mode: string;
    power: string;
    timeGMT: string;
  };
  fermenter: {
    title: string;
    beerType: string;
    temperature: string;
    gravity: string;
    total: string;
    timeRemaining: string;
  };
}

// Standard norske etiketter
export const defaultLabels: BrewingLabels = {
  brewKettle: {
    title: "Bryggekjele",
    temperature: "Temperatur",
    maltTemperature: "Malt Temperatur", 
    mode: "Modus",
    power: "Strøm",
    timeGMT: "Tid GMT"
  },
  fermenter: {
    title: "Gjæringstank",
    beerType: "Øltype",
    temperature: "Temperatur",
    gravity: "Vekt/Gravity",
    total: "Totalt volum",
    timeRemaining: "Tid igjen"
  }
};

// Hook for å hente etiketter (kan senere kobles til API)
export function useBrewingLabels(): BrewingLabels {
  // TODO: Koble til API senere for dynamiske etiketter
  // const { data } = useQuery('/api/brewing-labels');
  // return data || defaultLabels;
  
  return defaultLabels;
}