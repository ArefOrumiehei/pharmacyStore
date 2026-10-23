import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";

const SITE_URL = import.meta.env.VITE_SITE_URL;
const DEFAULT_TITLE = "فارماپلاس | داروخانه آنلاین شما";

type SeoProps = {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "product" | "article";
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
};

export default function Seo({
  title=DEFAULT_TITLE,
  description,
  image,
  type = "website",
  noindex,
  jsonLd,
}: SeoProps) {
  const { pathname } = useLocation();
  const canonical = `${SITE_URL}${pathname}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content="fa_IR" />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}