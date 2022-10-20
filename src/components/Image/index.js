// this component is used to display an image with a caption
// so styling is consistent

import React from "react";

const Image = ({ src, alt, caption, ...props }) => {
  return (
    <figure>
      <img src={src} alt={alt} {...props} />
      <figcaption
        style={{
          textAlign: "center",
          color: "gray",
          fontSize: "0.8rem",
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
};

export default Image;
