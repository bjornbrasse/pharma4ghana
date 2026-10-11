export const donationOptions = {
  materials: {
    amount: 10,
  },
  computer: {
    amount: 25,
  },
  student: {
    amount: 40,
  },
  custom: {
    amount: null,
  },
} as const;

export type DonationPurpose = keyof typeof donationOptions;
