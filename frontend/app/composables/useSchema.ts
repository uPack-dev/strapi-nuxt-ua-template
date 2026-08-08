/**
 * @param data - CMS record containing `seo.schema` entries.
 * @returns Nothing; registers JSON-LD scripts through `useHead`.
 * @example useSchema({ seo: { schema: [{ schema: { '@type': 'WebSite' } }] } })
 */
export const useSchema = (data?: Record<string, any>): void => {
  const schema =
    data?.seo?.schema?.map((item: Record<string, any>) => item.schema) || [];

  useHead({
    script: schema.map((item: unknown) => ({
      type: 'application/ld+json',
      children: JSON.stringify(item),
    })),
  });
};
