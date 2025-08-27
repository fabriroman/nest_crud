import UserForm from "./userForm";
import UserList from "./userList";
import { useState, useEffect } from "react";
import "./user.css";

const API_URL = "http://localhost:3000/api/users";

const Users = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [editingUser, setEditingUser] = useState(null);

  // Cargar usuarios
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error:", error);
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
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al crear");
      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
      resetForm();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API_URL}/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      const updatedUser = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      resetForm();
      setEditingUser(null);
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
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    });
  };

  const onCancelEdit = () => {
    setEditingUser(null);
    resetForm();
  };

  return (
    <div className="users-container">
      <h1 className="titulo">Gestión de Usuarios</h1>

      <UserForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isEditing={!!editingUser}
        onCancel={onCancelEdit}
      />

      <h2>Lista de Usuarios</h2>
      <UserList
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={onSelectUser}
      />
    </div>
  );
};

export default Users;
