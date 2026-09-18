"use client";

interface SmoothAnchorLinkProps {
  targetId: string;
  className: string;
  children: React.ReactNode;
}

export default function SmoothAnchorLink({
  targetId,
  className,
  children,
}: SmoothAnchorLinkProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(targetId);

    if (!target) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.history.pushState(null, "", `#${targetId}`);
  }

  return (
    <a href={`#${targetId}`} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}