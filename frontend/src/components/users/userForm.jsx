const UserForm = ({ formData, onChange, onSubmit, isEditing, onCancel }) => {
  return (
    <form onSubmit={onSubmit} className="user-form">
      <h2>{isEditing ? "Editar Usuario" : "Crear Usuario"}</h2>

      <input
        type="text"
        name="firstName"
        placeholder="Nombre"
        value={formData.firstName}
        onChange={onChange}
        required
      />
      <input
        type="text"
        name="lastName"
        placeholder="Apellido"
        value={formData.lastName}
        onChange={onChange}
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Teléfono"
        value={formData.phone}
        onChange={onChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={onChange}
        required
      />

      {/* Contenedor para los botones */}
      <div className="form-buttons">
        <button type="submit">{isEditing ? "Actualizar" : "Crear"}</button>
        {isEditing && (
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;
