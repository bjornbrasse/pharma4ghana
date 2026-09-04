export type AppLocale = "en" | "nl";

type MessagePostContent = {
  title: string;
  synopsis: string;
  imageAlt: string;
  body: string[];
  externalLink?: {
    label: string;
    href: string;
  };
  externalLinks?: {
    label: string;
    href: string;
  }[];
  checklist?: string[];
  supportList?: string[];
  hashtags?: {
    label: string;
    href: string;
  }[];
};

type MessagePostRecord = {
  slug: string;
  publishedAt: string;
  image: string;
  ogImage?: string;
  content: Record<AppLocale, MessagePostContent>;
};

export type LocalizedMessagePost = {
  slug: string;
  publishedAt: string;
  image: string;
  ogImage?: string;
  title: string;
  synopsis: string;
  imageAlt: string;
  body: string[];
  externalLink?: {
    label: string;
    href: string;
  };
  externalLinks?: {
    label: string;
    href: string;
  }[];
  checklist?: string[];
  supportList?: string[];
  hashtags?: {
    label: string;
    href: string;
  }[];
};

const messagePosts: MessagePostRecord[] = [
  {
    slug: "educational-grant-first-round",
    publishedAt: "2026-08-28",
    image: "/images/posts/graduated_students_2026.jpeg",
    ogImage: "/images/posts/graduated_students_2026.jpeg",
    content: {
      en: {
        title: "Educational Grant: First Round Completed",
        synopsis:
          "Pharma4Ghana completed the first Educational Grant round, enabling ten HAI students in Accra to continue their Pharmacy Technician training with financial support made possible by Brocacef.",
        imageAlt: "A group of graduating students celebrating outside the Health Access Institute in Accra",
        body: [
          "🎓 10 students. 10 opportunities. One step closer to sustainable pharmaceutical care in Ghana.",
          "Pharma4Ghana is proud to share that the first round of our Educational Grant has been completed successfully. Ten students from the Health Access Institute (HAI) in Accra have been selected for financial support in their Pharmacy Technician training.",
          "For many students in Ghana, paying tuition is a major challenge. Talent, ambition, and motivation are all there, but financial barriers can still stand in the way of successfully completing their education. That is why Pharma4Ghana supports students who stand out in motivation and academic performance with a contribution toward their training costs.",
          "This first round of the Educational Grant programme was made possible thanks to the support of Brocacef. Thanks to this valuable contribution, ten motivated students can continue their education and work toward a future in pharmaceutical care. We are deeply grateful to Brocacef for this support.",
          "Our mission is clear: every motivated student should have the opportunity to complete a pharmaceutical education, regardless of their financial situation. By investing in education, we also invest in the future of pharmaceutical care in Ghana.",
          "To make this ambition possible, we need your help.",
          "Interested in sponsoring or collaborating?",
          "Together, we invest in education, opportunity, and better pharmaceutical care.",
        ],
        checklist: [
          "First selection round completed successfully",
          "10 students supported",
          "Made possible by the support of Brocacef",
          "Strong collaboration with the Health Access Institute in Accra",
          "Ambition to continue the programme every year",
        ],
        supportList: [
          "support more students",
          "continue the Educational Grant programme structurally",
          "contribute to sustainable strengthening of healthcare in Ghana",
        ],
        externalLinks: [
          {
            label: "Brocacef",
            href: "https://www.linkedin.com/company/brocacef/",
          },
          {
            label: "contact@pharma4ghana.com",
            href: "mailto:contact@pharma4ghana.com",
          },
        ],
        hashtags: [
          {
            label: "#Pharma4Ghana",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23pharma4ghana&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#GlobalHealth",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23globalhealth&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Pharmacy",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23pharmacy&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#HealthcareEducation",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23healthcareeducation&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Ghana",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23ghana&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Education",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23education&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#CapacityBuilding",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23capacitybuilding&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Healthcare",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23healthcare&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Impact",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23impact&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Brocacef",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23brocacef&origin=HASH_TAG_FROM_FEED",
          },
        ],
      },
      nl: {
        title: "Educational Grant: eerste ronde afgerond",
        synopsis:
          "Pharma4Ghana heeft de eerste ronde van het Educational Grant-programma afgerond, waarmee tien HAI-studenten in Accra hun opleiding tot Pharmacy Technician kunnen voortzetten dankzij de steun van Brocacef.",
        imageAlt: "Een groep afstuderende studenten die samen feestviert bij het Health Access Institute in Accra",
        body: [
          "🎓 10 studenten. 10 kansen. Eén stap dichter bij duurzame farmaceutische zorg in Ghana.",
          "Met trots deelt Stichting Pharma4Ghana dat de eerste ronde van onze Educational Grant succesvol is afgerond. Tien studenten van het Health Access Institute (HAI) in Accra zijn geselecteerd voor financiele ondersteuning bij hun opleiding tot Pharmacy Technician.",
          "Voor veel studenten in Ghana vormt het betalen van collegegeld een grote uitdaging. Talent, ambitie en motivatie zijn volop aanwezig, maar financiele barrières kunnen een succesvolle afronding van de opleiding in de weg staan. Daarom ondersteunt Pharma4Ghana studenten die uitblinken in motivatie en studieprestaties met een bijdrage aan hun opleidingskosten.",
          "Deze eerste ronde van het Educational Grant-programma is mogelijk gemaakt dankzij de steun van Brocacef. Dankzij deze waardevolle bijdrage kunnen tien gemotiveerde studenten hun opleiding voortzetten en werken aan een toekomst in de farmaceutische zorg. Wij zijn Brocacef hiervoor zeer erkentelijk.",
          "Onze missie is helder: iedere gemotiveerde student moet de kans krijgen een farmaceutische opleiding af te ronden, ongeacht zijn of haar financiele situatie. Door te investeren in onderwijs investeren we tegelijkertijd in de toekomst van de farmaceutische zorg in Ghana.",
          "Om deze ambitie waar te maken, hebben wij uw hulp nodig.",
          "Interesse in sponsoring of een samenwerking?",
          "Samen investeren we in onderwijs, kansen en betere farmaceutische zorg.",
        ],
        checklist: [
          "Eerste selectieronde succesvol afgerond",
          "10 studenten ondersteund",
          "Mogelijk gemaakt door de steun van Brocacef",
          "Sterke samenwerking met het Health Access Institute in Accra",
          "Ambitie om het programma jaarlijks voort te zetten",
        ],
        supportList: [
          "meer studenten ondersteunen",
          "het Educational Grant-programma structureel voortzetten",
          "bijdragen aan duurzame versterking van de gezondheidszorg in Ghana",
        ],
        externalLinks: [
          {
            label: "Brocacef",
            href: "https://www.linkedin.com/company/brocacef/",
          },
          {
            label: "contact@pharma4ghana.com",
            href: "mailto:contact@pharma4ghana.com",
          },
        ],
        hashtags: [
          {
            label: "#Pharma4Ghana",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23pharma4ghana&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#GlobalHealth",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23globalhealth&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Pharmacy",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23pharmacy&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#HealthcareEducation",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23healthcareeducation&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Ghana",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23ghana&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Education",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23education&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#CapacityBuilding",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23capacitybuilding&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Healthcare",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23healthcare&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Impact",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23impact&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Brocacef",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23brocacef&origin=HASH_TAG_FROM_FEED",
          },
        ],
      },
    },
  },
  {
    slug: "marieke-liem-moolenaar-support",
    publishedAt: "2026-09-04",
    image: "/images/posts/books.jpeg",
    ogImage: "/images/posts/books.jpeg",
    content: {
      en: {
        title: "Thank You to Marieke Liem-Moolenaar",
        synopsis:
          "Marieke Liem-Moolenaar supported Pharma4Ghana with donations for students and English-language textbooks that strengthen practical learning in Ghana.",
        imageAlt: "English-language pharmaceutical textbooks collected to support students and healthcare professionals in Ghana",
        body: [
          "🌍💙 Thank you, Marieke! 💙🌍",
          "On behalf of Pharma4Ghana, we would like to thank Marieke Liem-Moolenaar, hospital pharmacist and founder of Grow with Care, for her generous support to our foundation.",
          "At her farewell, Marieke asked her colleagues and relations to make a financial contribution to Pharma4Ghana instead of a personal gift. The proceeds are intended to support students. In addition, she also wanted to contribute to our mission in another very concrete way. She collected English-language textbooks for transport to HAI, so that students and healthcare professionals have access to relevant and up-to-date pharmaceutical knowledge.",
          "Thanks to committed professionals like Marieke, we can continue to work on better access to pharmaceutical care, education, and support for healthcare professionals in Ghana. Her contribution goes beyond financial support alone. It invests in the development of future healthcare talent and in sustainable knowledge sharing.",
          "Marieke, your involvement and trust in our mission mean a great deal to us. Thanks in part to your support, we can continue to build a strong foundation for high-quality pharmaceutical care in Ghana.",
          "Let Marieke's example inspire others. Are you a pharmacist and do you also want to contribute to better pharmaceutical care and education in Ghana? Every contribution, big or small, makes a difference. Whether it is financial support, professional literature, or sharing knowledge and experience, together we can make a lasting impact.",
          "Thank you very much for your involvement, initiative, and support, Marieke!",
        ],
        externalLink: {
          label: "More about Marieke's work: growwithcare.nl",
          href: "https://growwithcare.nl/",
        },
        hashtags: [
          {
            label: "#Pharma4Ghana",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23pharma4ghana&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Dankbaar",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23dankbaar&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Farmacie",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23farmacie&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Ziekenhuisapotheek",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23ziekenhuisapotheek&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#GlobalHealth",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23globalhealth&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Healthcare",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23healthcare&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Kennisdeling",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23kennisdeling&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#SamenSterker",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23samensterker&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Ghana",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23ghana&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#ApothekersVoorGhana",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23apothekersvoorghana&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#GrowWithCare",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23growwithcare&origin=HASH_TAG_FROM_FEED",
          },
        ],
      },
      nl: {
        title: "Dank aan Marieke Liem-Moolenaar",
        synopsis:
          "Marieke Liem-Moolenaar steunde Pharma4Ghana met donaties voor studenten en Engelstalige studieboeken die het praktijkgerichte onderwijs in Ghana versterken.",
        imageAlt: "Engelstalige farmaceutische studieboeken die zijn ingezameld voor studenten en zorgprofessionals in Ghana",
        body: [
          "🌍💙 Dankjewel, Marieke! 💙🌍",
          "Namens Pharma4Ghana willen wij Marieke Liem-Moolenaar, ziekenhuisapotheker en oprichter van Grow with Care, hartelijk danken voor haar gulle steun aan onze stichting.",
          "Bij haar afscheid vroeg Marieke haar collega's en relaties om in plaats van een persoonlijk cadeau een financiele bijdrage te doen aan Pharma4Ghana. De opbrengst is bedoeld voor de ondersteuning van studenten. Daarnaast wilde zij ook op een andere, heel concrete manier bijdragen aan onze missie. Zij verzamelde Engelstalige studieboeken voor transport naar HAI, zodat studenten en zorgprofessionals toegang hebben tot relevante en actuele farmaceutische kennis.",
          "Dankzij betrokken professionals zoals Marieke kunnen wij blijven werken aan betere toegang tot farmaceutische zorg, onderwijs en ondersteuning voor zorgprofessionals in Ghana. Haar bijdrage gaat verder dan alleen financiele steun. Zij investeert in de ontwikkeling van toekomstig zorgtalent en in duurzame kennisdeling.",
          "Marieke, jouw betrokkenheid en vertrouwen in onze missie betekenen veel voor ons. Mede dankzij jouw steun kunnen wij blijven bouwen aan een sterke basis voor hoogwaardige farmaceutische zorg in Ghana.",
          "Laat het voorbeeld van Marieke anderen inspireren. Bent u apotheker en wilt u ook bijdragen aan betere farmaceutische zorg en onderwijs in Ghana? Iedere bijdrage, groot of klein, maakt verschil. Of het nu gaat om financiele steun, vakliteratuur of het delen van kennis en ervaring: samen kunnen we blijvende impact maken.",
          "Hartelijk dank voor je betrokkenheid, initiatief en steun, Marieke!",
        ],
        externalLink: {
          label: "Meer over het werk van Marieke: growwithcare.nl",
          href: "https://growwithcare.nl/",
        },
        hashtags: [
          {
            label: "#Pharma4Ghana",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23pharma4ghana&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Dankbaar",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23dankbaar&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Farmacie",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23farmacie&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Ziekenhuisapotheek",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23ziekenhuisapotheek&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#GlobalHealth",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23globalhealth&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Healthcare",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23healthcare&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Kennisdeling",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23kennisdeling&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#SamenSterker",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23samensterker&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Ghana",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23ghana&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#ApothekersVoorGhana",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23apothekersvoorghana&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#GrowWithCare",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23growwithcare&origin=HASH_TAG_FROM_FEED",
          },
        ],
      },
    },
  },
  


];

function sortNewestFirst<T extends { publishedAt: string }>(posts: T[]) {
  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getMessagePostSlugs() {
  return messagePosts.map((post) => post.slug);
}

export function getLocalizedMessagePosts(locale: AppLocale): LocalizedMessagePost[] {
  return sortNewestFirst(
    messagePosts.map((post) => ({
      slug: post.slug,
      publishedAt: post.publishedAt,
      image: post.image,
      ogImage: post.ogImage,
      ...post.content[locale],
    })),
  );
}

export function getLocalizedMessagePost(
  slug: string,
  locale: AppLocale,
): LocalizedMessagePost | null {
  const post = messagePosts.find((entry) => entry.slug === slug);

  if (!post) {
    return null;
  }

  return {
    slug: post.slug,
    publishedAt: post.publishedAt,
    image: post.image,
    ogImage: post.ogImage,
    ...post.content[locale],
  };
}

export function formatMessageDate(locale: AppLocale, publishedAt: string) {
  return new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(publishedAt));
}