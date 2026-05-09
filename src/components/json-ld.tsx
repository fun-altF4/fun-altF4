import { site } from "@/lib/site";

export default function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: `mailto:${site.email.personal}`,
    jobTitle: site.role,
    worksFor: {
      "@type": "Organization",
      name: site.company.name,
    },
    sameAs: [site.social.github, site.social.linkedin],
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Kubernetes",
      "Cloud Architecture",
      "Production Systems",
      "Backend Engineering",
    ],
  };

  return (
    <script type="application/ld+json">{JSON.stringify(person)}</script>
  );
}
