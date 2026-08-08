import { createConfigForNuxt } from '@nuxt/eslint-config';
import prettierConfig from '@vue/eslint-config-prettier';

export default createConfigForNuxt()
  .append(prettierConfig)
  .append({
    ignores: ['public/**'],
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'nuxt/prefer-import-meta': 'off',
      'vue/no-side-effects-in-computed-properties': 'off',
      'vue/no-v-html': 'off',
      'vue/padding-line-between-tags': 'error',
    },
  });
