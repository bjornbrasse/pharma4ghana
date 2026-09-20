import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkIns from "remark-ins";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import remarkDirective from "remark-directive";
import { remarkDirectives } from "@/components/markdown/remark-directives";
import { Achievements, DonationBlock } from "@/components/markdown/directive-containers";

type MarkdownProps = {
  children: string;
};

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks, remarkIns, remarkDirective, remarkDirectives]}
      components={{
        div: ({ node, children, ...props }) => {
          const component = node?.properties?.["data-component"];

          if (component === "achievements") {
            return <Achievements>{children}</Achievements>;
          }
          if (component === "donation") {
            return <DonationBlock>{children}</DonationBlock>;
          }

          return <div {...props}>{children}</div>;
        },

        p: ({ children }) => (
          <p className="text-base sm:text-lg leading-8 text-gray-700">{children}</p>
        ),
        h2: ({ children }) => (
          <h2 className="pt-2 text-2xl sm:text-3xl font-bold text-ghana-green">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="pt-2 text-lg sm:text-xl font-bold text-gray-700">{children}</h3>
        ),
        ul: ({ children }) => (
          <ul className="list-disc space-y-2 pl-6 text-base leading-8 text-gray-700 sm:text-lg">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal space-y-2 pl-6 text-base leading-8 text-gray-700 sm:text-lg">
            {children}
          </ol>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900">{children}</strong>
        ),
        em: ({ children }) => <em>{children}</em>,
        ins: ({ children }) => <span className="underline underline-offset-2">{children}</span>,
        a: ({ href, children }) => {
          if (!href) {
            return <>{children}</>;
          }

          const external = href.startsWith("https://") || href.startsWith("http://");

          if (external) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ghana-green underline underline-offset-2"
              >
                {children}
              </a>
            );
          }

          if (href.startsWith("mailto:")) {
            return (
              <a href={href} className="font-medium text-ghana-green underline underline-offset-2">
                {children}
              </a>
            );
          }

          return (
            <Link href={href} className="font-medium text-ghana-green underline underline-offset-2">
              {children}
            </Link>
          );
        },
        img: ({ src, alt }) => {
          if (typeof src !== "string") {
            return null;
          }

          return (
            <span className="relative my-8 block aspect-video overflow-hidden rounded-3xl">
              <Image
                src={src}
                alt={alt ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </span>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
