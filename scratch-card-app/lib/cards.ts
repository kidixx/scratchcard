export type CardType = {
  id: string;
  name: string;
  description: string;
  price: number;
};

// Placeholder data: change names and prices to match your school
export const cardTypes: CardType[] = [
  {
    id: "course-reg",
    name: "Course Registration Card",
    description: "Standard card for registering your courses this semester.",
    price: 3000,
  },
  {
    id: "late-reg",
    name: "Late Registration Card",
    description: "For students registering after the deadline.",
    price: 5000,
  },
  {
    id: "add-drop",
    name: "Add / Drop Card",
    description: "Change your registered courses after registration.",
    price: 2000,
  },
];

export const formatNaira = (n: number) => `₦${n.toLocaleString("en-NG")}`;