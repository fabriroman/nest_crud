import { useState, useEffect } from "react";
import UserProfileInfo from "./userProfileInfo";
import SocialMediaList from "./socialMediaList";
import AddSocialMediaForm from "./addSocialMediaForm";
import "./profile.css";
import { api } from "../../api";

const Profile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [socialMedia, setSocialMedia] = useState([]);
  const [newSocialMedia, setNewSocialMedia] = useState({ name: "", url: "" });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;

      try {
        // Obtener usuario
        const userData = await api.get(`api/users/${userId}`);
        if (!userData) {
          console.warn("No se encontró usuario");
          return;
        }
        setUser(userData);

        // Obtener redes sociales
        const socialData = await api.get(`api/users/${userId}/social-media`);
        setSocialMedia(socialData || []);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    };
    fetchProfileData();
  }, [userId]);

  // Cambiar datos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSocialMedia({ ...newSocialMedia, [name]: value });
  };

  // Añadir nueva red social
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const created = await api.post(
        `api/users/${userId}/social-media`,
        newSocialMedia
      );
      setSocialMedia([...socialMedia, created]);
      setNewSocialMedia({ name: "", url: "" });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Eliminar red social
  const handleDelete = async (id) => {
    try {
      await api.delete(`api/users/${userId}/social-media/${id}`);
      setSocialMedia(socialMedia.filter((sm) => sm.id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Mientras carga
  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Perfil de Usuario</h1>

      {/* Info del usuario */}
      <UserProfileInfo user={user} />

      <hr />

      {/* Redes sociales */}
      <h2>Redes Sociales</h2>
      {socialMedia.length === 0 ? (
        <p>No hay redes sociales registradas.</p>
      ) : (
        <SocialMediaList socialMedia={socialMedia} onDelete={handleDelete} />
      )}

      {/* Formulario para añadir */}
      <h3>Añadir Red Social</h3>
      <AddSocialMediaForm
        formData={newSocialMedia}
        onChange={handleChange}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default Profile;
