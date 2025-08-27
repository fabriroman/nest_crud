const UserItem = ({ user, onEdit, onDelete, onView }) => {
  return (
    <li>
      <div className="user-info">
        {user.firstName} {user.lastName} - {user.email}
      </div>
      <div className="user-actions">
        <button className="view-button" onClick={() => onView(user.id)}>
          Ver Perfil
        </button>
        <button className="edit-button" onClick={() => onEdit(user)}>
          Editar
        </button>
        <button className="delete-button" onClick={() => onDelete(user.id)}>
          Eliminar
        </button>
      </div>
    </li>
  );
};

export default UserItem;
