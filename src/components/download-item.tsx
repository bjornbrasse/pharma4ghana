import { DownloadIcon } from "lucide-react";

export function DownloadItem({ href, children }: { href?: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      // download
      className={
        "flex min-w-0 justify-between items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-2 font-normal text:xs md:text-lg text-gray-800 " +
        (href
          ? "transition-colors duration-500 hover:border-ghana-green hover:text-ghana-green hover:cursor-pointer"
          : " opacity-50 cursor-not-allowed")
      }
    >
      <span className="min-w-0 wrap-break-word">{children}</span>
      <DownloadIcon className="size-4 sm:size-5 shrink-0" aria-hidden="true" />
    </a>
  );
}
