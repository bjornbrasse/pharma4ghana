const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value?: string) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  const absoluteValue = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  return absoluteValue.endsWith("/") ? absoluteValue.slice(0, -1) : absoluteValue;
}

function isLocalSiteUrl(value: string) {
  const hostname = new URL(value).hostname;

  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function getSiteUrl() {
  const configuredUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const deploymentUrl =
    normalizeSiteUrl(process.env.URL) ?? normalizeSiteUrl(process.env.DEPLOY_PRIME_URL);

  if (configuredUrl && !(process.env.NODE_ENV === "production" && isLocalSiteUrl(configuredUrl))) {
    return configuredUrl;
  }

  if (deploymentUrl) {
    return deploymentUrl;
  }

  return configuredUrl ?? DEFAULT_SITE_URL;
}

export function getAbsoluteSiteUrl(pathname: string) {
  return new URL(pathname, `${getSiteUrl()}/`).toString();
}