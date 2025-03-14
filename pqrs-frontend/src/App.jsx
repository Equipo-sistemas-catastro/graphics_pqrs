import React, { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Asegúrate de importar Router, Routes y Route
import Dashboard from "./components/Dashboard"; // Importamos el Dashboard
// Importar otros componentes si los tienes
// import Home from './components/Home'; // Si tienes una página de inicio

const App = () => {
  // Estados
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [errorLoginMessage, setErrorLoginMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }

    const fetchPQRS = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pqrs");
        const data = await response.json();
        console.log("PQRS:", data);
      } catch (error) {
        console.log("Error obteniendo PQRS:", error);
      }
    };
    fetchPQRS();
  }, []);

  // Registro de usuario
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registro exitoso");
        setFullName('');
        setUsername('');
        setEmail('');
        setPassword('');
        alert("Usuario registrado con éxito!");
      } else {
        alert(data.message || "Error al registrar usuario");
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      alert("Hubo un error al intentar registrar el usuario.");
    }
  };

  // Inicio de sesión
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log('Inicio de sesión:', { loginEmail, loginPassword });

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Inicio de sesión exitoso');
        setIsAuthenticated(true);
        setIsLoginOpen(false);
        
        // Redirigir al usuario a /dashboard
        navigate("/dashboard");
      } else {
        setErrorLoginMessage(data.message || 'Error en las credenciales');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorLoginMessage("Hubo un error al autenticar la sesión");
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <>
      <Routes>
        <Route path="/" element={
          !isAuthenticated ? (
            <>
              {/* Formulario de Registro */}
              <form onSubmit={handleRegisterSubmit} className="bg-green-100 w-80 mx-auto mt-8 rounded-lg p-6">
                <p className="mb-2 text-gray-600">⚠️ Si no tienes usuario, regístrate</p>

                <label htmlFor="fullName" className="block text-gray-600 mb-1">Nombre Completo</label>
                <input id="fullName" type="text" placeholder="Fullname"
                  className="bg-green-200 border w-full px-3 py-2 mb-4 rounded-md focus:ring-green-400"
                  value={fullName} onChange={(e) => setFullName(e.target.value)} />

                <label htmlFor="username" className="block text-gray-600 mb-1">Usuario</label>
                <input id="username" type="text" placeholder="Username"
                  className="bg-green-200 border w-full px-3 py-2 mb-4 rounded-md focus:ring-green-400"
                  value={username} onChange={(e) => setUsername(e.target.value)} />

                <label htmlFor="email" className="block text-gray-600 mb-1">Correo Electrónico</label>
                <input id="email" type="email" placeholder="Email"
                  className="bg-green-200 border w-full px-3 py-2 rounded-md focus:ring-green-400"
                  value={email} onChange={(e) => setEmail(e.target.value)} />

                <label htmlFor="password" className="block text-gray-600 mb-1 mt-4">Contraseña</label>
                <input id="password" type="password" placeholder="Password"
                  className="bg-green-200 border w-full px-3 py-2 mb-4 rounded-md focus:ring-green-400"
                  value={password} onChange={(e) => setPassword(e.target.value)} />

                <input type="submit" value="Registrar"
                  className="bg-green-300 w-full py-2 text-blue-600 rounded-md cursor-pointer hover:bg-green-200" />
                
                {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
              </form>

              {/* Enlace para abrir el modal de login */}
              <div className="text-center">
                <button onClick={() => setIsLoginOpen(true)} className="mt-3 text-gray-600 hover:text-gray-800 mb-3">
                  😎 Ya tienes usuario?
                </button>
              </div>

              {/* Modal de Login */}
              {isLoginOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
                    <button className="absolute top-2 right-3 text-gray-600 hover:text-gray-900"
                      onClick={() => setIsLoginOpen(false)}>
                      ✖
                    </button>
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Iniciar Sesión</h2>

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <label htmlFor="loginEmail" className="block text-gray-600 mb-1">Correo Electrónico</label>
                      <input id="loginEmail" type="email" placeholder="Correo electrónico"
                        className="w-full px-3 py-2 border rounded-md focus:ring-green-500"
                        value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />

                      <label htmlFor="loginPassword" className="block text-gray-600 mb-1">Contraseña</label>
                      <input id="loginPassword" type="password" placeholder="Contraseña"
                        className="w-full px-3 py-2 border rounded-md focus:ring-green-600"
                        value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />

                      <button type="submit" className="w-full bg-green-300 text-blue-600 py-2 rounded-md hover:bg-green-200">
                        Entrar
                      </button>
                    </form>

                    {errorLoginMessage && <p className="text-red-500 text-center mt-4">{errorLoginMessage}</p>}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center mt-10">
              <h2 className="text-3xl font-bold">Bienvenido al Sistema de PQRS</h2>
              <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Cerrar Sesión
              </button>
            </div>
          )
        } />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default App;
