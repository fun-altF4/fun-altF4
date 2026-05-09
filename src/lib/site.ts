export const site = {
  name: "Bhavesh Varma",
  url: "https://bhaveshvarma.com",
  role: "Technical Head, Dialphone",
  shortBio:
    "Production AI/ML, Kubernetes, and full-stack systems.",
  longBio:
    "Bhavesh Varma — technical head and product owner at Dialphone. Production AI for the vape and automotive sectors. Previously at ContexIQ (CitiusCloud partnership). Linux/Hyprland daily-driver.",
  email: {
    personal: "bhavesh.opportunity@gmail.com",
    work: "bhavesh@dialphone.com",
  },
  social: {
    github: "https://github.com/fun-altF4",
    githubHandle: "fun-altF4",
    linkedin: "https://www.linkedin.com/in/bhavesh-varma-a3aa0427b/",
    linkedinHandle: "bhavesh-varma",
  },
  company: {
    name: "Dialphone",
    sectors: ["Vape", "Automotive"],
  },
  keywords: [
    "Bhavesh Varma",
    "Dialphone",
    "Technical Head",
    "AI engineer",
    "Kubernetes",
    "Production ML",
    "Backend engineer",
    "Cloud architect",
    "Full-stack",
    "Next.js",
  ],
} as const;

export const nav = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/work", label: "work" },
  { href: "/contact", label: "contact" },
] as const;
