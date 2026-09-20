import DonationNoticeButton from "@/components/donation-notice-button";
import { useTranslations } from "next-intl";

export function Achievements({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        rounded-2xl bg-ghana-green/10 p-6
        [&_ul]:space-y-3
        [&_ul]:list-none
        [&_ul]:p-0
        [&_li]:relative
        [&_li]:pl-8
        [&_li]:text-base
        [&_li]:leading-8
        [&_li]:text-gray-700
        sm:[&_li]:text-lg
        [&_li]:before:absolute
        [&_li]:before:left-0
        [&_li]:before:content-['✓']
        [&_li]:before:font-bold
        [&_li]:before:text-ghana-green
      "
    >
      {children}
    </div>
  );
}

export function DonationBlock({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");

  return (
    <div className="flex gap-4 items-start rounded-xl bg-ghana-gold/20 border border-ghana-gold p-2 sm:p-4">
      <p>{children}</p>
      <DonationNoticeButton
        className="hidden md:inline-flex items-center px-6 py-2 text-sm font-semibold rounded-md bg-ghana-green text-white hover:bg-ghana-green-dark transition-colors"
        unavailableClassName="hidden md:inline-flex items-center px-6 py-2 text-sm font-semibold rounded-md bg-gray-300 text-gray-600 hover:bg-gray-200 transition-colors"
      >
        {t("donateButton")}
      </DonationNoticeButton>
    </div>
  );
}
