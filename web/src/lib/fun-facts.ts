export type FunFact = {
  /** Stable id; used as the React key. */
  id: string;
  /** One-liner revealed by each Keep going press. */
  text: string;
};

/**
 * Homepage Keep going facts. The landing page shows three at a time and
 * rotates through this list like a wheel. Add, remove, or reorder entries.
 */
export const funFacts: FunFact[] = [
  {
    id: "skydiving",
    text: "Once done skydiving, scary, but fun",
  },
  {
    id: "ecommerce-recsys",
    text: "Worked on ecommerce recommendation systems",
  },
  {
    id: "electronic-music",
    text: "Used to make electronic music",
  },
  {
    id: "manchester",
    text: "Worked with semiconductors in Manchester, UK",
  },
  {
    id: "msc-thesis",
    text: "Helped raise seed funding for a startup",
  },
  {
    id: "kth",
    text: "Studied MSc in Machine Learning at KTH",
  },
  {
    id: "karate",
    text: "Practiced karate for 8 years",
  },
  {
    id: "livedat",
    text: "Lived in Stockholm, Budapest, Manchester",
  },
  {
    id: "cod4",
    text: "Countless hours in Call of Duty 4",
  },
  {
    id: "best-movie",
    text: "Believes that Interstellar is the best movie",
  },
  {
    id: "fraud-detection",
    text: "Worked on Pay by Bank ML fraud prevention",
  },
];
