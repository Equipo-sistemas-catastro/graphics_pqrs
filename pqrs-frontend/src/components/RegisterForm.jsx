import React from 'react';

const RegisterForm = ({ fullName, setFullName, username, setUsername, email, setEmail, password, setPassword, handleRegisterSubmit, errorMessage }) => {
  return (
    <form onSubmit={handleRegisterSubmit} className="bg-green-100 w-80 mx-auto mt-8 rounded-lg p-6 shadow-lg">
      <p className="mb-3 text-gray-600">⚠️ Si no tienes usuario, regístrate</p>

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
  );
};

export default RegisterForm;
