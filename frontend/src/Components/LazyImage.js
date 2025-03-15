import React from 'react';

const LazyImage = ({ src, alt, priority }) => {
  return (
    <img
      src={src}
      className="novels-cover"
      alt={alt}
      width="250"
      height="350"
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
};

export default LazyImage;