interface RedirectRule {
  from: string;
  to: string;
  code?: string;
}

const redirectConfig: RedirectRule[] = [];

const CODES = [
  {
    name: 'Permanent – 301',
    code: 301,
  },
  {
    name: 'Temporary – 302',
    code: 302,
  },
];

/**
 * @returns Route middleware applying exact and wildcard CMS redirects.
 * @example // `{ from: '/old', to: '/new' }` redirects while preserving query.
 */
export default defineNuxtRouteMiddleware((to) => {
  const GlobalStore = useGlobalStore();
  let targetPath, matchedRedirect;

  const allRedirects = [
    ...redirectConfig,
    ...GlobalStore.redirects,
  ] as RedirectRule[];

  for (const r of allRedirects) {
    if (r.from === to.path) {
      targetPath = r.to;
      matchedRedirect = r;
      break;
    }

    if (r.from.endsWith('/**')) {
      const prefixFrom = r.from.replace('**', '');

      if (to.path.startsWith(prefixFrom)) {
        const remainder = to.path.slice(prefixFrom.length);

        if (r.to.endsWith('/**')) {
          const prefixTo = r.to.replace('**', '');
          targetPath = prefixTo + remainder;
        } else {
          targetPath = r.to;
        }

        matchedRedirect = r;
        break;
      }
    }
  }

  if (matchedRedirect && targetPath && targetPath !== to.path) {
    const redirectCode =
      CODES.find((c) => c.name === matchedRedirect.code)?.code || 301;

    return navigateTo(
      {
        path: targetPath,
        query: to.query,
      },
      { redirectCode },
    );
  }
});
