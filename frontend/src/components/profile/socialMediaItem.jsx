import SocialMediaIcon from "../../assets/SocialMediaIcon";

const SocialMediaItem = ({ social, onDelete }) => {
  return (
    <li>
      <SocialMediaIcon name={social.name} />
      <a href={social.url} target="_blank" rel="noopener noreferrer">
        {social.name}
      </a>
      <button onClick={() => onDelete(social.id)}>Eliminar</button>
    </li>
  );
};

export default SocialMediaItem;
