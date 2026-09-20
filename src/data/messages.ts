export type AppLocale = "en" | "nl";

type MessagePostContent = {
  title: string;
  author?: string;
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
  imageClasses?: string;
  ogImage?: string;
  content: Record<AppLocale, MessagePostContent>;
};

export type LocalizedMessagePost = {
  author?: string;
  slug: string;
  publishedAt: string;
  image: string;
  imageClasses?: string;
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
    slug: "a-warm-welcome-in-Ghana",
    publishedAt: "2026-09-11",
    image: "/images/Jasmijn_en_Jasmijn_voor_klas_HAI.jpg",
    imageClasses: "object-right",
    ogImage: "/images/Jasmijn_en_Jasmijn_voor_klas_HAI2.jpg",
    content: {
      en: {
        title: "A warm welcome in Ghana: our first weeks",
        author: "Jasmijn Offringa (22) & Jasmijn Hazeleger (22)",
        synopsis:
          "As the first two students from Pharma4Ghana, we are super happy to share our internship experiences here. 😊 We have now been staying in Accra, Ghana for 2.5 weeks. Here we are doing our internship at the Health Access Institute and Health Access Network...",
        imageAlt: "HAI students in class",
        body: [
          "At the Health Access Institute, students are trained to become Pharmacy Technicians (comparable to a pharmacy assistant in The Netherlands) over three years. Many students also combine their studies with a job. Many students work after their classes from 3:00 PM to 10:00 PM, which we admire a lot. We mainly work on assignments to contribute to the organization of and around the lessons. Today, we were also allowed to give a lesson to the first-year students about gastrointestinal medicines. The students had covered this topic in the past two weeks, and our task was to test their knowledge. The students participated enthusiastically and were eager to answer as many questions correctly as possible (and win Dutch stroopwafels!). It was very enjoyable to contribute to the education in this way. We hope that Kahoots will be included in many more lessons!",
          "We are under the guidance of Dr. Charles Allotey. He pays a lot of attention to establishing and maintaining contacts. Therefore, we have already made various trips to different pharmacies, the National Vaccines Institute (NVI), Die Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ), the Food and Drugs Authority (FDA), and much more.",
          "The people in Ghana are super kind. They wave, smile kindly, and really make us feel welcome as foreigners in Ghana. People are eager to interact with us, and many prefer to show us all of Ghana in a single day. These small interactions with the local people have become memorable moments for us. From invitations to a wedding or church service to being proposed to multiple times in a day. The wedding was an amazing experience, but we have (so far) declined the marriage proposals. 🙈",
          "Our schedule now includes two short internships: a two-week internship at a compounding pharmacy in Kumasi and a two-week internship at a hospital in Berekum! In between, we have weekends where we want to see and experience as much of Ghana as possible. For example, one of us will participate in the Millennial 5km Run organized in Accra this coming weekend (the other Jasmijn will cheer very loudly). Last weekend, we traveled to the Cape Coast to spend a night on the beach, combined with a visit to the Cape Coast Museum and the Kakum National Park.",
          "So there is still plenty on the schedule, and we look forward to discovering much more of Ghana, the pharmacy in Ghana, and the people here in the coming weeks! 🤩",
        ],
        externalLinks: [
          {
            label: "HAI",
            href: "https://haighana.edu.gh",
          },
          {
            label: "GIZ",
            href: "https://www.giz.de/de",
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
        ],
      },
      nl: {
        title: "Een warm welkom in Ghana: onze eerste weken",
        author: "Jasmijn Offringa (22) & Jasmijn Hazeleger (22)",
        synopsis:
          "Als eerste twee studenten vanuit Pharma4Ghana zijn wij superblij dat wij hier onze stage-ervaring mogen delen. 😊 Inmiddels verblijven we alweer 2,5 week in Accra, Ghana. Hier lopen wij stage bij het Health Access Institute en Health Access Network.",
        imageAlt: "Studenten van de HAI krijgen les",
        body: [
          "Bij de Health Access Institute worden studenten in drie jaar opgeleid tot Pharmacy Technician (vergelijkbaar met apothekersassistent). Veel studenten combineren hun studie daarnaast met een baan. Zo werken veel studenten na hun lessen van 15.00 tot 22.00 uur, voor ons bizar. Zelf werken we hier vooral aan opdrachten om zo bij te dragen aan de organisatie van en rondom de lessen. Vandaag mochten wij zelf ook een les geven aan de eerstejaars over gastrointestinal medicines. De studenten hebben dit onderwerp de afgelopen twee weken behandeld en aan ons was de vraag om hun kennis te testen. De studenten deden superenthousiast mee en waren fanatiek bezig om zoveel mogelijk vragen goed te beantwoorden (en stroopwafels te winnen!). Het was erg leuk om op deze manier zelf bij te dragen aan het onderwijs. We hopen dan ook dat de Kahoots in nog veel meer lessen terug zullen komen!",
          "We worden begeleid door dr. Charles Allotey. Hij besteedt veel aandacht aan het leggen én onderhouden van contacten. Vandaar dat we inmiddels al allerlei uitstapjes hebben gemaakt naar verschillende apotheken, het National Vaccines Institute (NVI), Die Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ), de Food and Drugs Authority (FDA) en nog veel meer.",
          "Verder zijn de mensen in Ghana  super lief. Ze zwaaien, glimlachen vriendelijk en geven ons echt het gevoel dat we als buitenlander van harte welkom zijn in Ghana. Er wordt graag contact met ons gemaakt en veel mensen laten het liefst in één dag heel Ghana aan ons zien. Juist deze kleine interacties met de lokale mensen zijn memorabele momenten voor ons geworden. Van uitnodigingen voor een bruiloft of kerkdienst tot aan zelf meerdere keren op een dag ten huwelijk worden gevraagd. De bruiloft was een hele gave ervaring, maar de huwelijksaanzoeken hebben we (tot nu toe) toch maar afgeslagen. 🙈",
          "Op onze planning staan nu nog twee korte stages: een tweeweekse stage in een bereidingsapotheek in Kumasi en een tweeweekse stage in een ziekenhuis in Berekum! Met daartussen weekendjes waarop we zoveel mogelijk van Ghana willen zien én ervaren. Zo doet één van ons aankomend weekend ook mee met de Millennial 5km Run georganiseerd in Accra (de andere Jasmijn juicht heel hard toe). Of reisden we vorig weekend naar de Cape Coast om een nachtje op het strand te slapen, gecombineerd met een bezoekje aan het Cape Coast Museum en het Kakum National Park.",
          "Er staat dus nog genoeg op de planning en we kijken ernaar uit om de komende weken nog veel meer van Ghana, de farmacie in Ghana en de mensen hier te ontdekken! 🤩",
        ],
        externalLinks: [
          {
            label: "HAI",
            href: "https://haighana.edu.gh",
          },
          {
            label: "GIZ",
            href: "https://www.giz.de/de",
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
        imageAlt:
          "English-language pharmaceutical textbooks collected to support students and healthcare professionals in Ghana",
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
        imageAlt:
          "Engelstalige farmaceutische studieboeken die zijn ingezameld voor studenten en zorgprofessionals in Ghana",
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
        imageAlt:
          "A group of graduating students celebrating outside the Health Access Institute in Accra",
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
            label: "#Healthcare",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23healthcare&origin=HASH_TAG_FROM_FEED",
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
        imageAlt:
          "Een groep afstuderende studenten die samen feestviert bij het Health Access Institute in Accra",
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
            label: "#Healthcare",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23healthcare&origin=HASH_TAG_FROM_FEED",
          },
          {
            label: "#Brocacef",
            href: "https://www.linkedin.com/search/results/all/?keywords=%23brocacef&origin=HASH_TAG_FROM_FEED",
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
      imageClasses: post.imageClasses,
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
