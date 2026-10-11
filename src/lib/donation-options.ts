export const donationOptions = {
  materials: {
    amount: 10,
    stripeProductId: "prod_VQD6H1KreEXuxe",
  },
  computer: {
    amount: 25,
    stripeProductId: "prod_VQD8ppvD8w0QDA",
  },
  student: {
    amount: 40,
    stripeProductId: "prod_VQDANH8xfnZjUt",
  },
  custom: {
    amount: null,
    stripeProductId: "prod_VQ7q4uWIuTJeNR",
  },
} as const;

export type DonationPurpose = keyof typeof donationOptions;

export function getDonationPurposeForProduct(productId: string, originalPurpose?: string) {
  for (const purpose of ["materials", "computer", "student", "custom"] as const) {
    if (donationOptions[purpose].stripeProductId === productId) {
      return purpose;
    }
  }
  return originalPurpose ?? "custom";
}
