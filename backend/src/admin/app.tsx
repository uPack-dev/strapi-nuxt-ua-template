import type { StrapiApp } from '@strapi/strapi/admin';
import uk from './translations/uk.json';
import Logo from './extensions/logo.svg';

export default {
  config: {
    locales: ['uk'],
    translations: {
      uk,
    },
    auth: {
      logo: Logo,
    },
    menu: {
      logo: Logo,
    },
    head: {
      favicon: Logo,
    },
  },
  bootstrap(_app: StrapiApp) {},
};
