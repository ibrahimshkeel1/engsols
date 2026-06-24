type Props = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Embeds schema.org JSON-LD for search engines. */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
