import { Helmet } from 'react-helmet-async';

/**
 * SEO — reusable component that injects <title>, meta description,
 * Open Graph, and Twitter Card tags into <head> for each page.
 */
const SEO = ({
  title,
  description = 'La Maison — Experience the art of fine dining with exquisite dishes crafted from the freshest ingredients. Located in New York\'s Culinary District.',
  image = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  url,
  type = 'website',
}) => {
  const siteTitle = 'La Maison — Fine Dining Restaurant';
  const fullTitle = title ? `${title} | La Maison` : siteTitle;

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
      <meta property="og:site_name" content="La Maison" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
