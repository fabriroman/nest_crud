import SocialMediaItem from "./socialMediaItem";

const SocialMediaList = ({ socialMedia, onDelete }) => {
  if (socialMedia.length === 0) {
    return <p>No tiene redes sociales registradas.</p>;
  }

  return (
    <ul className="social-media-list">
      {Array.isArray(socialMedia) ? (
        socialMedia.map((sm) => (
          <SocialMediaItem key={sm.id} social={sm} onDelete={onDelete} />
        ))
      ) : (
        <p>Cargando o error al cargar redes sociales.</p>
      )}
    </ul>
  );
};

export default SocialMediaList;
