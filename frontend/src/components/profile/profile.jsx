import { useState, useEffect } from "react";
import UserProfileInfo from "./userProfileInfo";
import SocialMediaList from "./socialMediaList";
import AddSocialMediaForm from "./addSocialMediaForm";
import "./profile.css";

const API_URL = "http://localhost:3000/api";

const Profile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [socialMedia, setSocialMedia] = useState([]);
  const [newSocialMedia, setNewSocialMedia] = useState({ name: "", url: "" });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;

      try {
        // Obtener usuario
        const userRes = await fetch(`${API_URL}/users/${userId}`);
        const userData = await userRes.json();
        setUser(userData);

        // Obtener redes sociales
        const socialRes = await fetch(
          `${API_URL}/users/${userId}/social-media`
        );
        const socialData = await socialRes.json();
        setSocialMedia(socialData);
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
      const res = await fetch(`${API_URL}/users/${userId}/social-media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSocialMedia),
      });

      if (!res.ok) throw new Error("Error al crear");

      const created = await res.json();
      setSocialMedia([...socialMedia, created]);
      setNewSocialMedia({ name: "", url: "" }); // limpiar formulario
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Eliminar red social
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/users/${userId}/social-media/${id}`, {
        method: "DELETE",
      });
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
      <SocialMediaList socialMedia={socialMedia} onDelete={handleDelete} />

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
