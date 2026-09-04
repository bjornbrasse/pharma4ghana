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
  hashtags?: {
    label: string;
    href: string;
  }[];
};

const messagePosts: MessagePostRecord[] = [
  {
    slug: "marieke-liem-moolenaar-support",
    publishedAt: "2026-09-04",
    image: "/images/books.jpeg",
    ogImage: "/images/books.jpeg",
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
  {
    slug: "growing-our-scholar-network",
    publishedAt: "2026-06-28",
    image: "/images/members/trea_avatar.jpg",
    content: {
      en: {
        title: "Growing Our Scholar Network in Accra",
        synopsis:
          "A new round of student conversations in Accra made one thing clear: practical support matters most when it stays close to the classroom.",
        imageAlt: "Pharma4Ghana team member portrait for the Accra scholarship update",
        body: [
          "During our latest visit in Accra, we met with students who are balancing demanding coursework, internships, and family responsibilities. Their stories were different, but the pattern was consistent: modest financial barriers still interrupt otherwise promising academic progress.",
          "The most valuable part of the visit was not a formal presentation. It was the time spent listening to what students actually need right now: transport support for placements, access to dependable study materials, and mentoring that connects theory to practice.",
          "These conversations are shaping how we prioritise the next round of support. We want every euro to remove a practical obstacle so students can keep moving toward graduation and professional practice with confidence.",
        ],
      },
      nl: {
        title: "Ons netwerk van studenten in Accra groeit",
        synopsis:
          "Een nieuwe ronde gesprekken met studenten in Accra maakte opnieuw duidelijk dat praktische ondersteuning het meeste effect heeft wanneer die dicht bij het onderwijs blijft.",
        imageAlt: "Portret van een Pharma4Ghana-teamlid bij de update over studiebeurzen in Accra",
        body: [
          "Tijdens ons recente bezoek aan Accra spraken we met studenten die hun opleiding combineren met stages en verantwoordelijkheden thuis. Hun verhalen verschilden, maar het patroon was hetzelfde: relatief kleine financiële drempels verstoren nog steeds een studiepad met veel potentie.",
          "Het waardevolste deel van het bezoek was geen formele presentatie, maar de tijd die we namen om te luisteren naar wat studenten nu echt nodig hebben: ondersteuning voor vervoer naar stageplekken, toegang tot betrouwbaar studiemateriaal en mentorschap dat theorie aan de praktijk koppelt.",
          "Die gesprekken bepalen hoe wij de volgende ronde ondersteuning vormgeven. We willen dat iedere euro een concrete hindernis wegneemt, zodat studenten met vertrouwen verder kunnen richting afstuderen en hun werk in de zorgpraktijk.",
        ],
      },
    },
  },
  {
    slug: "why-practice-based-teaching-matters",
    publishedAt: "2026-05-16",
    image: "/images/members/barbara_avatar.jpg",
    content: {
      en: {
        title: "Why Practice-Based Teaching Matters",
        synopsis:
          "The strongest feedback from our Ghanaian partners is also the clearest: students benefit most when lessons mirror the decisions they will face in real care settings.",
        imageAlt: "Pharma4Ghana team member portrait for the practice-based teaching message",
        body: [
          "At Pharma4Ghana, we do not see education support as funding alone. Better outcomes come from combining scholarships with stronger teaching formats that prepare students for the decisions, constraints, and responsibilities of day-to-day pharmacy work.",
          "That is why we continue to support practice-oriented learning, including case-based discussions, supervised exercises, and direct exchange between professionals in Ghana and the Netherlands. These methods help students connect knowledge to action.",
          "For us, this is the long-term value of the foundation: not only helping students stay enrolled, but helping them become confident healthcare professionals who are ready to contribute from day one.",
        ],
      },
      nl: {
        title: "Waarom praktijkgericht onderwijs ertoe doet",
        synopsis:
          "De duidelijkste boodschap van onze Ghanese partners is ook de belangrijkste: studenten hebben het meeste aan onderwijs dat lijkt op de keuzes die zij later in de zorgpraktijk moeten maken.",
        imageAlt: "Portret van een Pharma4Ghana-teamlid bij het bericht over praktijkgericht onderwijs",
        body: [
          "Bij Pharma4Ghana zien we onderwijsondersteuning niet als alleen financiering. Betere resultaten ontstaan wanneer studiebeurzen samengaan met sterkere onderwijsvormen die studenten voorbereiden op de beslissingen, beperkingen en verantwoordelijkheden van het dagelijkse werk in de farmacie.",
          "Daarom blijven wij praktijkgericht leren ondersteunen, bijvoorbeeld via casusbesprekingen, begeleide oefeningen en directe uitwisseling tussen professionals uit Ghana en Nederland. Deze aanpak helpt studenten om kennis om te zetten in handelen.",
          "Voor ons ligt daarin de duurzame waarde van de stichting: niet alleen studenten helpen om ingeschreven te blijven, maar hen ook laten uitgroeien tot zelfverzekerde zorgprofessionals die vanaf hun eerste werkdag kunnen bijdragen.",
        ],
      },
    },
  },
  {
    slug: "small-donations-real-tools",
    publishedAt: "2026-03-04",
    image: "/images/members/bjorn_avatar.jpg",
    content: {
      en: {
        title: "Small Donations, Real Tools for Students",
        synopsis:
          "Support becomes tangible very quickly when it pays for the materials students use every week: books, protective equipment, and the basics that keep training on track.",
        imageAlt: "Pharma4Ghana team member portrait for the study materials update",
        body: [
          "Not every barrier is dramatic. Sometimes progress depends on simple, practical items that students should be able to rely on without hesitation. Study guides, lab essentials, and basic equipment make a visible difference because they affect learning immediately.",
          "This is one reason we communicate so directly about donations. Contributions do not disappear into abstraction. They become the tools, access, and continuity that help a student complete the next assignment, the next placement, and eventually the full programme.",
          "When donors ask what their support changes, this is the clearest answer we can give: it helps turn talent and motivation into completed training and stronger local healthcare capacity.",
        ],
      },
      nl: {
        title: "Kleine donaties, echte hulpmiddelen voor studenten",
        synopsis:
          "Ondersteuning wordt snel concreet wanneer zij het studiemateriaal betaalt dat studenten elke week gebruiken: boeken, beschermingsmiddelen en andere basisvoorzieningen die hun opleiding op koers houden.",
        imageAlt: "Portret van een Pharma4Ghana-teamlid bij de update over studiematerialen",
        body: [
          "Niet iedere drempel is groot of spectaculair. Soms hangt voortgang af van eenvoudige, praktische middelen waarop studenten zonder twijfel moeten kunnen rekenen. Studiehandleidingen, labbenodigdheden en basisuitrusting maken direct verschil omdat zij het leren meteen beïnvloeden.",
          "Dat is ook waarom wij zo concreet communiceren over donaties. Bijdragen verdwijnen niet in iets abstracts. Ze worden omgezet in hulpmiddelen, toegang en continuïteit die een student helpen de volgende opdracht, de volgende stage en uiteindelijk de volledige opleiding af te ronden.",
          "Wanneer donateurs vragen wat hun steun precies verandert, is dit het duidelijkste antwoord dat we kunnen geven: hun bijdrage helpt talent en motivatie om te zetten in een afgeronde opleiding en sterkere lokale zorgcapaciteit.",
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