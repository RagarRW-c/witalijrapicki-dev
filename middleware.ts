import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Lista języków
  locales: ['pl', 'en'],
  // Domyślny język
  defaultLocale: 'pl',
  // Brak prefiksu dla domyślnego
  localePrefix: 'as-needed',
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};