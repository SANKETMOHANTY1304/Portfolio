export const chapters = [
  {
    href: "/",
    label: "Home",
    number: "00",
    description: "An introduction to the work.",
  },
  {
    href: "/about",
    label: "About",
    number: "01",
    description: "The person, the questions, the approach.",
  },
  {
    href: "/projects",
    label: "Projects",
    number: "02",
    description: "Ideas explored through working systems.",
  },
  {
    href: "/experience",
    label: "Experience",
    number: "03",
    description: "Contributions, teams, and lessons from practice.",
  },
  {
    href: "/skills",
    label: "Skills",
    number: "04",
    description: "A toolkit for turning questions into software.",
  },
  {
    href: "/education",
    label: "Education",
    number: "05",
    description: "Foundations, credentials, and continued learning.",
  },
  {
    href: "/contact",
    label: "Contact",
    number: "06",
    description: "The next conversation starts here.",
  },
] as const;
export type Chapter = (typeof chapters)[number];
