import { Button, Heading, Hr, Img, Link, Section, Text } from "@react-email/components";
import { render } from "@react-email/render";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkIns from "remark-ins";
import { P4G_EMAIL_COLORS, P4G_EMAIL_SITE_URL, P4gEmail } from "../../convex/lib/email/p4g_email";
import { remarkDirectives } from "@/components/markdown/remark-directives";
import { type AppLocale, getLocalizedMessagePost } from "@/lib/messages";

type NewsletterEmailProps = {
  locale: AppLocale;
  markdown: string;
  unsubscribeUrl: string;
};

function getFrontMatterString(data: Record<string, unknown>, field: string) {
  const value = data[field];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function absoluteUrl(value: string) {
  return new URL(value, `${P4G_EMAIL_SITE_URL}/`).toString();
}

function BlogPreview({ slug, locale }: { slug: string; locale: AppLocale }) {
  let post;

  try {
    post = getLocalizedMessagePost(slug, locale);
  } catch {
    return (
      <Section style={missingBlog}>
        <Text style={missingBlogText}>
          {locale === "nl" ? "Blogbericht niet gevonden" : "Blog post not found"}: {slug}
        </Text>
      </Section>
    );
  }

  return (
    <Section style={blogCard}>
      <Img src={absoluteUrl(post.image)} alt={post.imageAlt} width="514" style={blogImage} />
      <Section style={blogContent}>
        <Text style={blogEyebrow}>{locale === "nl" ? "Laatste nieuws" : "Latest news"}</Text>
        <Heading as="h3" style={blogTitle}>
          {post.title}
        </Heading>
        <Text style={blogSynopsis}>{post.synopsis}</Text>
        <Button href={absoluteUrl(`/${locale}/messages/${post.slug}`)} style={blogButton}>
          {locale === "nl" ? "Lees het bericht" : "Read the article"}
        </Button>
      </Section>
    </Section>
  );
}

function NewsletterMarkdown({ markdown, locale }: { markdown: string; locale: AppLocale }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks, remarkIns, remarkDirective, remarkDirectives]}
      components={{
        div: ({ node, children }) => {
          const component = node?.properties?.["data-component"];
          const slug = node?.properties?.["data-blog-slug"];

          if (component === "blog" && typeof slug === "string") {
            return <BlogPreview slug={slug} locale={locale} />;
          }

          return <Section>{children}</Section>;
        },
        h1: ({ children }) => (
          <Heading as="h1" style={headingOne}>
            {children}
          </Heading>
        ),
        h2: ({ children }) => (
          <Heading as="h2" style={headingTwo}>
            {children}
          </Heading>
        ),
        h3: ({ children }) => (
          <Heading as="h3" style={headingThree}>
            {children}
          </Heading>
        ),
        p: ({ children }) => <Text style={paragraph}>{children}</Text>,
        a: ({ href, children }) => (
          <Link href={href ?? P4G_EMAIL_SITE_URL} style={link}>
            {children}
          </Link>
        ),
        img: ({ src, alt }) =>
          typeof src === "string" ? (
            <Img src={absoluteUrl(src)} alt={alt ?? ""} width="514" style={contentImage} />
          ) : null,
        ul: ({ children }) => <ul style={list}>{children}</ul>,
        ol: ({ children }) => <ol style={list}>{children}</ol>,
        li: ({ children }) => <li style={listItem}>{children}</li>,
        blockquote: ({ children }) => <blockquote style={quote}>{children}</blockquote>,
        hr: () => <Hr style={divider} />,
        mark: ({ children }) => <span style={highlight}>{children}</span>,
        ins: ({ children }) => <u>{children}</u>,
        code: ({ children }) => <code style={code}>{children}</code>,
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}

export function NewsletterEmail({ locale, markdown, unsubscribeUrl }: NewsletterEmailProps) {
  const parsed = matter(markdown);
  const previewText =
    getFrontMatterString(parsed.data, "previewText") ??
    (locale === "nl" ? "Nieuws van Pharma4Ghana" : "News from Pharma4Ghana");

  return (
    <P4gEmail
      locale={locale}
      preview={previewText}
      deliveryNote={
        locale === "nl"
          ? "U ontvangt deze e-mail omdat u bent ingeschreven voor onze nieuwsbrief."
          : "You received this email because you subscribed to our newsletter."
      }
    >
      <NewsletterMarkdown markdown={parsed.content} locale={locale} />
      <Hr style={divider} />
      <Text style={unsubscribeText}>
        {locale === "nl" ? "Geen nieuwsbrieven meer ontvangen?" : "No longer want our newsletter?"}{" "}
        <Link href={unsubscribeUrl} style={link}>
          {locale === "nl" ? "Uitschrijven" : "Unsubscribe"}
        </Link>
      </Text>
    </P4gEmail>
  );
}

export async function renderNewsletterEmail(props: Omit<NewsletterEmailProps, "unsubscribeUrl">) {
  const parsed = matter(props.markdown);
  const title = getFrontMatterString(parsed.data, "title");
  const subject = getFrontMatterString(parsed.data, "subject") ?? title;
  const previewText = getFrontMatterString(parsed.data, "previewText") ?? subject;

  if (!title || !subject || !previewText) {
    throw new Error("Newsletter front matter requires title, subject, and previewText.");
  }

  const email = (
    <NewsletterEmail
      {...props}
      unsubscribeUrl={`${P4G_EMAIL_SITE_URL}/api/newsletter/unsubscribe?token=preview`}
    />
  );
  const [html, text] = await Promise.all([render(email), render(email, { plainText: true })]);

  return { title, subject, previewText, html, text };
}

const { green, paleGreen, ink, muted } = P4G_EMAIL_COLORS;
const headingOne = { margin: "0 0 22px", color: ink, fontSize: "28px", lineHeight: "35px" };
const headingTwo = { margin: "30px 0 14px", color: green, fontSize: "22px", lineHeight: "29px" };
const headingThree = { margin: "24px 0 10px", color: ink, fontSize: "18px", lineHeight: "25px" };
const paragraph = { margin: "0 0 18px", color: "#405462", fontSize: "15px", lineHeight: "24px" };
const link = { color: green, textDecoration: "underline" };
const list = {
  margin: "0 0 18px",
  paddingLeft: "24px",
  color: "#405462",
  fontSize: "15px",
  lineHeight: "24px",
};
const listItem = { marginBottom: "6px" };
const quote = {
  margin: "22px 0",
  padding: "4px 0 4px 18px",
  borderLeft: `4px solid ${green}`,
  color: muted,
};
const divider = { margin: "28px 0", borderColor: "#dce8e3" };
const highlight = { padding: "1px 3px", backgroundColor: "#fff0a8", color: ink };
const code = {
  padding: "2px 4px",
  backgroundColor: "#edf1ef",
  color: ink,
  fontFamily: "monospace",
};
const contentImage = {
  display: "block",
  width: "100%",
  height: "auto",
  margin: "22px 0",
  borderRadius: "4px",
};
const blogCard = {
  margin: "28px 0",
  overflow: "hidden",
  border: "1px solid #dce8e3",
  borderRadius: "6px",
  backgroundColor: "#ffffff",
};
const blogImage = { display: "block", width: "100%", height: "auto" };
const blogContent = { padding: "22px" };
const blogEyebrow = {
  margin: "0 0 6px",
  color: green,
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.7px",
  textTransform: "uppercase" as const,
};
const blogTitle = { margin: "0 0 10px", color: ink, fontSize: "20px", lineHeight: "27px" };
const blogSynopsis = { margin: "0 0 18px", color: "#405462", fontSize: "14px", lineHeight: "22px" };
const blogButton = {
  display: "inline-block",
  padding: "11px 17px",
  borderRadius: "4px",
  backgroundColor: green,
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: "700",
  textDecoration: "none",
};
const missingBlog = {
  margin: "22px 0",
  padding: "16px",
  border: "1px solid #e4b5b5",
  borderRadius: "4px",
  backgroundColor: "#fff5f5",
};
const missingBlogText = { margin: "0", color: "#9f2727", fontSize: "13px" };
const unsubscribeText = {
  margin: "0",
  color: muted,
  fontSize: "11px",
  lineHeight: "18px",
  textAlign: "center" as const,
};
