const SectionHeader = ({ title, subtitle, light = false, className = '' }) => {
  return (
    <div className={`text-center mb-12 md:mb-16 ${className}`}>
      <h2
        className={`section-title ${light ? 'text-white' : 'text-dark'}`}
      >
        {title}
      </h2>
      <div className="divider-gold my-4" />
      {subtitle && (
        <p className={`section-subtitle ${light ? 'text-gray-300' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
