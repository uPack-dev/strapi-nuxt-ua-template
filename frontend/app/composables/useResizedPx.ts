/**
 * Get reactive px value regarding element font-size
 * @param {number} pxValue desired px value
 * @param {Ref<HTMLElement>|HTMLElement|string} [contextElement] reference element or selector
 * @returns {Ref<UnwrapRef<number>>} reactive calculated px value
 * @example
 * const contextElementRef = ref(null);
 * const resizedPx = useResizedPx(10, contextElementRef);
 * onMounted(() => console.log(resizedPx.value));
 */
export const useResizedPx = (
  pxValue: number,
  contextElement?: Ref<HTMLElement | null> | HTMLElement | string,
): Ref<number> => {
  const resizedPxValue = ref(pxValue);

  const isElementRef = isRef(contextElement);

  function setResizedPxValue() {
    const element = isElementRef ? contextElement.value : contextElement;

    resizedPxValue.value = toResizedPx(pxValue, element || undefined);
  }

  onMounted(() => {
    setResizedPxValue();
    useEventListener(window, 'resize', setResizedPxValue);
  });

  return resizedPxValue;
};
