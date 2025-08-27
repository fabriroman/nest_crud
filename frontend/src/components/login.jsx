import React, { useState } from 'react';
import './login.css';

const Login = () => {

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!user|| !password) {
            setError('Por favor, rellene todos los campos.');
            return;
        }

        console.log("Login exitoso");
    }

    return (
        
         
        <div className="login-container">
            
            <h1>LOGIN</h1>
            
            <form className='login-form' onSubmit={handleSubmit}>
               
                <h2>Ingrese su usuario y contraseña</h2>
                {error && <div className='error'>{error}</div>}

                <div className='form-group'>
                    <label htmlFor='user'>Usuario: </label>
                    <input type='text' id='user' value={user} onChange={(e) => setUser(e.target.value)} placeholder='usuario'/> 
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Contraseña: </label>
                    <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='contraseña'/>
                </div>
                <button type='submit' className='login-button'>Iniciar sesion</button>

            </form>
        </div>
    )
}
export default Login;