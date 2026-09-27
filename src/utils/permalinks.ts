/**
 * Official school domain configuration and permalink generators
 */
export const OFFICIAL_DOMAIN = 'https://eds.edu.mn';

/**
 * Generate official shareable link for news article
 */
export const getNewsPermalink = (slugOrId: string): string => {
  return `${OFFICIAL_DOMAIN}/#news/${slugOrId}`;
};

/**
 * Generate official shareable link for curriculum / school program
 */
export const getProgramPermalink = (slugOrId: string): string => {
  return `${OFFICIAL_DOMAIN}/#program/${slugOrId}`;
};

/**
 * Generate official shareable link for institutional article (About us / School rules / etc.)
 */
export const getArticlePermalink = (slugOrId: string): string => {
  return `${OFFICIAL_DOMAIN}/#article/${slugOrId}`;
};

/**
 * Generate official link for programs portal
 */
export const getProgramsPortalPermalink = (): string => {
  return `${OFFICIAL_DOMAIN}/#programs-portal`;
};
