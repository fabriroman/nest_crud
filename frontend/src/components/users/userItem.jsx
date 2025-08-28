const UserItem = ({
  user,
  onEdit,
  onDelete,
  onView,
  isUser,
  isAdmin,
  currentUserId,
}) => {
  // Asegurarse de que las props booleanas tengan un valor por defecto
  const safeIsUser = isUser || false;
  const safeIsAdmin = isAdmin || false;
  const safeCurrentUserId = currentUserId || null;

  // Lógica para determinar que botones mostrar
  const canEdit = safeIsAdmin || (safeIsUser && user.id === safeCurrentUserId);
  const canDelete = safeIsAdmin && user.id !== safeCurrentUserId; // Admin no puede eliminarse a si mismo
  const canView = true; // Todos pueden ver perfiles

  return (
    <li>
      <div className="user-info">
        {user.firstName} {user.lastName} - {user.email}
        {user.roles && user.roles.length > 0 && (
          <span className="user-role"> ({user.roles[0].name})</span>
        )}
      </div>
      <div className="user-actions">
        {canView && (
          <button className="view-button" onClick={() => onView(user.id)}>
            Ver Perfil
          </button>
        )}

        {canEdit && (
          <button className="edit-button" onClick={() => onEdit(user)}>
            Editar
          </button>
        )}

        {canDelete && (
          <button className="delete-button" onClick={() => onDelete(user.id)}>
            Eliminar
          </button>
        )}
      </div>
    </li>
  );
};

export default UserItem;
