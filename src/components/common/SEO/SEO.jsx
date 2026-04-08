import { Helmet } from 'react-helmet-async';

/**
 * SEO — reusable component that injects <title>, meta description,
 * Open Graph, and Twitter Card tags into <head> for each page.
 */
const SEO = ({
  title,
  description = 'Aresh Al Madinah Restaurant — Taste the World on One Plate. Authentic Pakistani, Indian & Desi cuisine in Dubai. Karahi, Biryani, BBQ & more.',
  image = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  url,
  type = 'website',
}) => {
  const siteTitle = 'Aresh Al Madinah Restaurant — Dubai';
  const fullTitle = title ? `${title} | Aresh Al Madinah` : siteTitle;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content="Aresh Al Madinah Restaurant" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
