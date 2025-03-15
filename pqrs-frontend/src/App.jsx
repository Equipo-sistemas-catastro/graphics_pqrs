import React, { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Dashboard from "./components/Dashboard";
import RegisterForm from './components/RegisterForm';  // Importamos RegisterForm
import LoginModal from './components/LoginModal';    // Importamos LoginModal

const App = () => {
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
        alert("Usuario registrado con éxito!");
        setFullName('');
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        alert(data.message || "Error al registrar usuario");
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      alert("Hubo un error al intentar registrar el usuario.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
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
        navigate("/dashboard");
      } else {
        setErrorLoginMessage(data.message || 'Error en las credenciales');
      }
    } catch (error) {
      setErrorLoginMessage("Hubo un error al autenticar la sesión");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="bg-gradient-to-r from-green-100 via-green-200 to-violet-200">
      <Routes>
        <Route path="/" element={
          !isAuthenticated ? (
            <>
              <h1 className="text-4xl font-extrabold text-center pt-4 pb-3 italic overline tracking-wider text-gray-600">
                Sistema de PQRS
              </h1>

              <RegisterForm 
                fullName={fullName} setFullName={setFullName} 
                username={username} setUsername={setUsername} 
                email={email} setEmail={setEmail} 
                password={password} setPassword={setPassword} 
                handleRegisterSubmit={handleRegisterSubmit} 
                errorMessage={errorMessage} 
              />

              <div className="text-center">
                <button onClick={() => setIsLoginOpen(true)} className="mt-3 text-gray-600 hover:text-gray-800 mb-5">
                  😎 Ya tienes usuario?
                </button>
              </div>

              <LoginModal 
                isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen}
                loginEmail={loginEmail} setLoginEmail={setLoginEmail}
                loginPassword={loginPassword} setLoginPassword={setLoginPassword}
                handleLoginSubmit={handleLoginSubmit}
                errorLoginMessage={errorLoginMessage}
              />
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
    </div>
  );
};

export default App;
