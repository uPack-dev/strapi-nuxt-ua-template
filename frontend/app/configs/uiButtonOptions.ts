export const BUTTON_THEME = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
} as const;

export const BUTTON_SIZE = {
  SM: 'sm',
} as const;

export const BUTTON_ACTION = {
  LINK: 'link',
  EXTERNAL_LINK: 'link:external',
  CALLBACK_MODAL: 'modal:callback',
} as const;

/**
 * Maps a Strapi button action to CLinkTag props and local behavior.
 * @param action - Strapi action value.
 * @param link - Optional action target.
 * @returns Link props and whether the callback modal should open.
 * @example getButtonActionProps(BUTTON_ACTION.EXTERNAL_LINK, '/catalog')
 */
export const getButtonActionProps = (
  action: string,
  link: string | boolean | undefined,
) => {
  const isExternal = action === BUTTON_ACTION.EXTERNAL_LINK;
  const isCallback = action === BUTTON_ACTION.CALLBACK_MODAL;

  return {
    link: isCallback ? false : link,
    external: isExternal,
    target: isExternal ? '_blank' : undefined,
    isCallback,
  };
};
