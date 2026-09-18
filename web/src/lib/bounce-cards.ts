export type BounceCardImage = {
  src: string;
  alt: string;
};

export const bounceCardImages: BounceCardImage[] = [
  {
    src: "/panel_1.png",
    alt: "Once done skydiving, scary, but fun",
  },
  {
    src: "/panel_2.png",
    alt: "Worked on ecommerce recommendation systems",
  },
  {
    src: "/panel_4.png",
    alt: "Worked with semiconductors in Manchester, UK",
  },
  {
    src: "/panel_5.png",
    alt: "Helped raise seed funding for a startup",
  },
  {
    src: "/panel_6.png",
    alt: "Studied MSc in Machine Learning at KTH",
  },
  {
    src: "/panel_7.png",
    alt: "Practiced karate for 8 years",
  },
  {
    src: "/panel_12.png",
    alt: "I practice lindy hop dancing with my partner",
  },
  {
    src: "/panel_11.png",
    alt: "Worked on Pay by Bank ML fraud prevention",
  },
];

const MAX_TRANSLATE_PX = 240;
const MAX_ROTATE_DEG = 12;

export const bounceCardSrcs = bounceCardImages.map((card) => card.src);
export const bounceCardAlts = bounceCardImages.map((card) => card.alt);

export const bounceCardTransformStyles = bounceCardImages.map(
  (_, index, cards) => {
    const t = cards.length === 1 ? 0.5 : index / (cards.length - 1);
    const x = (t - 0.5) * 2 * MAX_TRANSLATE_PX;
    const r = (t - 0.5) * 2 * MAX_ROTATE_DEG;
    return `rotate(${r}deg) translate(${x}px)`;
  },
);
