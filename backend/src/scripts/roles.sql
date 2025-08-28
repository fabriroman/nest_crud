-- 1. Crear roles por defecto
INSERT INTO roles (name, description) VALUES 
('admin', 'Administrator with full access'),
('user', 'Regular user with limited access');

-- 2. Crear usuario admin (la contraseña será '123456')
INSERT INTO users ("firstName", "lastName", phone, email, password) VALUES 
('Admin', 'User', '+1234567890', 'admin@example.com', '$2b$10$iZnXONpJKNQERucNKby4zuAsdHgzM/hM7g/wjLJnDENqSqa.hMZ.O');

DO $$
DECLARE
    admin_user_id INTEGER;
    admin_role_id INTEGER;
BEGIN
    -- Obtener ID del usuario admin
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@example.com';
    
    -- Obtener ID del rol admin
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    -- Crear la relación user_roles
    INSERT INTO user_roles ("userId", "roleId") VALUES (admin_user_id, admin_role_id)
    ON CONFLICT DO NOTHING;
END $$;
-- 4. Crear usuario normal (rol user)
INSERT INTO users ("firstName", "lastName", phone, email, password) VALUES 
('Normal', 'User', '+0987654321', 'user@example.com', '$2b$10$iZnXONpJKNQERucNKby4zuAsdHgzM/hM7g/wjLJnDENqSqa.hMZ.O');

-- 5. Asignar rol user al usuario normal
DO $$
DECLARE
    normal_user_id INTEGER;
    user_role_id INTEGER;
BEGIN
    -- Obtener ID del usuario normal
    SELECT id INTO normal_user_id FROM users WHERE email = 'user@example.com';
    -- Obtener ID del rol user
    SELECT id INTO user_role_id FROM roles WHERE name = 'user';
    -- Crear la relación user_roles
    INSERT INTO user_roles ("userId", "roleId") VALUES (normal_user_id, user_role_id)
    ON CONFLICT DO NOTHING;
END $$;