import { z } from "zod";
import { donationOptions } from "@/lib/donation-options";

export const donationFrequencies = ["monthly", "once"] as const;

export const donationSchema = z
  .object({
    amount: z.number().finite().int().min(5).max(1_000),
    frequency: z.enum(donationFrequencies),
    locale: z.enum(["en", "nl"]),
    purpose: z.enum(["materials", "computer", "student", "custom"]),
  })
  .superRefine((donation, context) => {
    const configuredAmount = donationOptions[donation.purpose].amount;

    if (configuredAmount !== null && donation.amount !== configuredAmount) {
      context.addIssue({
        code: "custom",
        path: ["amount"],
        message: "The amount does not match the selected donation purpose.",
      });
    }
  });

export type DonationInput = z.infer<typeof donationSchema>;
