const AddSocialMediaForm = ({ formData, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="social-media-form">
      <input
        type="text"
        name="name"
        placeholder="Nombre (ej: Twitter)"
        value={formData.name}
        onChange={onChange}
        required
      />
      <input
        type="url"
        name="url"
        placeholder="URL"
        value={formData.url}
        onChange={onChange}
        required
      />
      <button type="submit">Añadir</button>
    </form>
  );
};

export default AddSocialMediaForm;
