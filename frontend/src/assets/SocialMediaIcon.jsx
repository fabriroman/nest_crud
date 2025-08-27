import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaGlobe } from "react-icons/fa";

const SocialMediaIcon = ({ name }) => {
  const iconSize = 24;

  switch (name.toLowerCase()) {
    case "facebook":
      return <FaFacebook size={iconSize} />;
    case "twitter":
      return <FaTwitter size={iconSize} />;
    case "instagram":
      return <FaInstagram size={iconSize} />;
    default:
      return <FaGlobe size={iconSize} />;
  }
};

export default SocialMediaIcon;
