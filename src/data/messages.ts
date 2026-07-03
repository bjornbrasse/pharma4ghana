export type AppLocale = "en" | "nl";

type MessagePostContent = {
  title: string;
  synopsis: string;
  imageAlt: string;
  body: string[];
};

type MessagePostRecord = {
  slug: string;
  publishedAt: string;
  image: string;
  content: Record<AppLocale, MessagePostContent>;
};

export type LocalizedMessagePost = {
  slug: string;
  publishedAt: string;
  image: string;
  imagePath: string;
  title: string;
  synopsis: string;
  imageAlt: string;
  body: string[];
};

import { getAbsoluteSiteUrl } from "@/lib/site-url";

const messagePosts: MessagePostRecord[] = [
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
      image: getAbsoluteSiteUrl(post.image),
      imagePath: post.image,
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
    image: getAbsoluteSiteUrl(post.image),
    imagePath: post.image,
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