export type CvEntry = {
  dates: string;
  title: string;
  org: string;
  place: string;
  highlights: string[];
};

export const cvSummary =
  "Machine learning engineer with six years of experience shipping production ML and GenAI systems in fintech and e-commerce. Based in Stockholm, from Budapest, previously Manchester.";

export const experience: CvEntry[] = [
  {
    dates: "Aug 2025 – Present",
    title: "Machine Learning Engineer",
    org: "Trustly",
    place: "Stockholm, Sweden",
    highlights: [
      "Real-time machine learning for fraud detection on pay-by-bank payments.",
    ],
  },
  {
    dates: "Dec 2022 – Aug 2025",
    title: "Machine Learning Engineer",
    org: "Sellpy",
    place: "Stockholm, Sweden",
    highlights: [
      "Production ML, recommendations, and MLOps for second-hand e-commerce.",
      "Vector search over image and text embeddings for real-time personalization.",
      "Led a garment size-extraction system (LLMs) aimed at cutting size-related returns.",
    ],
  },
  {
    dates: "Aug 2020 – Dec 2022",
    title: "Machine Learning Engineer",
    org: "Ecobloom",
    place: "Stockholm, Sweden",
    highlights: [
      "Distributed GCP pipelines and deep learning for plant leaf detection and stress recognition.",
      "Helped stand up the first B2B and B2C products and presented the ML work for a $400k first round.",
    ],
  },
  {
    dates: "Sep 2018 – Aug 2019",
    title: "Research and Development Engineer",
    org: "Nexperia",
    place: "Manchester, United Kingdom",
    highlights: [
      "Python simulation and analysis software for semiconductor device design, plus manufacturing-data insights.",
    ],
  },
];

export const education: CvEntry[] = [
  {
    dates: "2020 – 2022",
    title: "MSc, Machine Learning",
    org: "KTH Royal Institute of Technology",
    place: "Stockholm, Sweden",
    highlights: [
      "Thesis: Semi-Supervised Plant Leaf Detection and Stress Recognition, supervised by Prof. Josephine Sullivan.",
      "Teaching assistant, DD2424 Deep Learning in Data Science.",
    ],
  },
  {
    dates: "2016 – 2020",
    title: "BEng, Electronic Engineering, First-Class Honours",
    org: "The University of Manchester",
    place: "Manchester, United Kingdom",
    highlights: [
      "Final-year project: real-time object detection on an NVIDIA Jetson Nano for a robotic arm, supervised by Prof. Hujun Yin.",
    ],
  },
];
