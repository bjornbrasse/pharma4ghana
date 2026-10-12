export const donationProducts = [
  {
    purpose: "materials",
    amount: 10,
    stripeProductId: "prod_VQD6H1KreEXuxe",
  },
  {
    purpose: "computer",
    amount: 25,
    stripeProductId: "prod_VQD8ppvD8w0QDA",
  },
  {
    purpose: "student",
    amount: 40,
    stripeProductId: "prod_VQDANH8xfnZjUt",
  },
  {
    purpose: "custom",
    amount: null,
    stripeProductId: "prod_VQ7q4uWIuTJeNR",
  },
] as const;

export type DonationPurpose = (typeof donationProducts)[number]["purpose"];

type DonationOptions = {
  [Product in (typeof donationProducts)[number] as Product["purpose"]]: Omit<
    Product,
    "purpose"
  >;
};

export const donationOptions = Object.fromEntries(
  donationProducts.map(({ purpose, ...product }) => [purpose, product]),
) as DonationOptions;

export function getDonationPurposeForProduct(productId: string, originalPurpose?: string) {
  return (
    donationProducts.find((product) => product.stripeProductId === productId)?.purpose ??
    originalPurpose ??
    "custom"
  );
}
