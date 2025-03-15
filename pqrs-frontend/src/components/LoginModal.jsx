import React from 'react';

const LoginModal = ({ isLoginOpen, setIsLoginOpen, loginEmail, setLoginEmail, loginPassword, setLoginPassword, handleLoginSubmit, errorLoginMessage }) => {
  if (!isLoginOpen) return null;

  return (
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
  );
};

export default LoginModal;
