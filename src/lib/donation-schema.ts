import { z } from "zod";

export const donationFrequencies = ["monthly", "once"] as const;

export const donationSchema = z.object({
  amount: z.number().finite().int().min(5).max(1_000),
  frequency: z.enum(donationFrequencies),
  locale: z.enum(["en", "nl"]),
});

export type DonationInput = z.infer<typeof donationSchema>;
