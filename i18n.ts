import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Ensure that the incoming `locale` is valid
  if (!locale || !['fr', 'en'].includes(locale)) {
    locale = 'fr';
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
