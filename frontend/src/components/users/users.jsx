import UserForm from "./userForm";
import UserList from "./userList";
import { useState, useEffect } from "react";
import "./user.css";
import { api } from "../../api";

const API_ENDPOINT = "api/users";

const Users = ({ onSelectUser, isUser, isAdmin, currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Cargar usuarios
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      resetForm();
      setEditingUser(null);
      setShowForm(false);
    }
  }, [currentUserId]);

  const fetchUsers = async () => {
    try {
      let fetchedData;

      if (isUser && currentUserId) {
        // iusuario normal pide solo su id
        const me = await api.get(`api/users/${currentUserId}`);
        fetchedData = [me];
      } else {
        // admin obtiene la lista completa
        fetchedData = await api.get(API_ENDPOINT);
      }

      setUsers(fetchedData);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Crear o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      await handleUpdate();
    } else {
      await handleCreate();
    }
  };

  const handleCreate = async () => {
    try {
      // const res = await fetch(API_URL, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      // if (!res.ok) throw new Error("Error al crear");
      // const newUser = await res.json();
      // setUsers((prev) => [...prev, newUser]);
      // resetForm();

      const newUser = await api.post(API_ENDPOINT, formData);
      setUsers((prev) => [...prev, newUser]);
      resetForm();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      // const res = await fetch(`${API_URL}/${editingUser.id}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      // if (!res.ok) throw new Error("Error al actualizar");
      // const updatedUser = await res.json();
      // setUsers((prev) =>
      //   prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      // );
      // resetForm();
      // setEditingUser(null);

      const updateData = { ...formData };
      if (!updateData.password || updateData.password.trim() === "") {
        delete updateData.password;
      }

      const updatedUser = await api.patch(
        `${API_ENDPOINT}/${editingUser.id}`,
        updateData
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      resetForm();
      setEditingUser(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      password: "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      // const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      // if (!res.ok) throw new Error("Error al eliminar");
      // setUsers((prev) => prev.filter((u) => u.id !== id));

      await api.delete(`${API_ENDPOINT}/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleShowCreateForm = () => {
    resetForm();
    setEditingUser(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
    });
  };

  const onCancelEdit = () => {
    setEditingUser(null);
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="users-container">
      <h1 className="titulo">Gestión de Usuarios</h1>

      {(isAdmin ||
        (isUser && editingUser && editingUser.id === currentUserId)) && (
        <UserForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isEditing={!!editingUser}
          onCancel={onCancelEdit}
        />
      )}
      <h2>Lista de Usuarios</h2>
      <UserList
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={onSelectUser}
        isUser={isUser}
        isAdmin={isAdmin}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default Users;
