import { z } from "zod";
import { donationOptions } from "@/lib/donation-options";

export const donationFrequencies = ["monthly", "once"] as const;

const donationFields = z.object({
  amount: z.number().finite().int().min(5).max(1_000),
  frequency: z.enum(donationFrequencies),
  locale: z.enum(["en", "nl"]),
  purpose: z.enum(["materials", "computer", "student", "custom"]),
});

function validateDonationPurpose(
  donation: z.infer<typeof donationFields>,
  context: z.RefinementCtx,
) {
  const configuredAmount = donationOptions[donation.purpose].amount;

  if (configuredAmount !== null && donation.amount !== configuredAmount) {
    context.addIssue({
      code: "custom",
      path: ["amount"],
      message: "The amount does not match the selected donation purpose.",
    });
  }
}

export const donationSchema = donationFields.superRefine(validateDonationPurpose);

export const donationCheckoutSchema = donationFields
  .extend({
    donorName: z.string().trim().min(1).max(120),
    donorEmail: z
      .email()
      .max(254)
      .transform((email) => email.toLowerCase()),
    confirmEmail: z
      .email()
      .max(254)
      .transform((email) => email.toLowerCase()),
    newsletterOptIn: z.boolean(),
  })
  .superRefine((donation, context) => {
    validateDonationPurpose(donation, context);

    if (donation.donorEmail !== donation.confirmEmail) {
      context.addIssue({
        code: "custom",
        path: ["confirmEmail"],
        message: "Email addresses do not match.",
      });
    }
  });

export type DonationInput = z.infer<typeof donationSchema>;
export type DonationCheckoutInput = z.infer<typeof donationCheckoutSchema>;
