export type CardType = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export const cardTypes: CardType[] = [
  {
    id: "course-reg",
    name: "Course Registration Card",
    description: "Use this card to register your courses this semester.",
    price: 3500,
  },
];

export const formatNaira = (n: number) => `₦${n.toLocaleString("en-NG")}`;