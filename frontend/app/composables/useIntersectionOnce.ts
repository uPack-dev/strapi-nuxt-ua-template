import { useIntersectionObserver } from '@vueuse/core';
import type {
  MaybeElementRef,
  UseIntersectionObserverOptions,
} from '@vueuse/core';

/**
 * @param target - Element/ref observed for intersection.
 * @param cb - Callback invoked on the first intersection.
 * @param options - Native observer options. Defaults to threshold `0.3`.
 * @returns Nothing; observation stops after the first intersection.
 * @example useIntersectionOnce(element, () => loadContent())
 */
export const useIntersectionOnce = (
  target: MaybeElementRef,
  cb?: () => void,
  options: UseIntersectionObserverOptions = { threshold: 0.3 },
): void => {
  const { stop } = useIntersectionObserver(
    target,
    ([entry]) => {
      if (entry?.isIntersecting) {
        cb?.();

        stop();
      }
    },
    options,
  );
};
