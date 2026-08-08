import { describe, expect, it } from 'vitest';
import { BUTTON_ACTION, getButtonActionProps } from './uiButtonOptions';

describe('button actions', () => {
  it('maps link, external link and callback actions', () => {
    expect([
      getButtonActionProps(BUTTON_ACTION.LINK, '/catalog'),
      getButtonActionProps(BUTTON_ACTION.EXTERNAL_LINK, '/catalog'),
      getButtonActionProps(BUTTON_ACTION.CALLBACK_MODAL, '/catalog'),
    ]).toEqual([
      {
        link: '/catalog',
        external: false,
        target: undefined,
        isCallback: false,
      },
      {
        link: '/catalog',
        external: true,
        target: '_blank',
        isCallback: false,
      },
      {
        link: false,
        external: false,
        target: undefined,
        isCallback: true,
      },
    ]);
  });
});
