# 📌 Gráficas para la gestión de las PQRS


## 📖 Descripción

- Este es un proyecto desarrollado con React, Express, y Vite, que incluye autenticación, gráficos interactivos con Chart.js, Highcharts, y Recharts, además de comunicación con APIs mediante Axios.



📌 **Frontend (React + Vite)**

- [React 19](https://react.dev/)
- [React Router Dom](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Chart.js](https://www.chartjs.org/) + [Chartjs-plugin-datalabels](https://chartjs-plugin-datalabels.netlify.app/)
- [Highcharts](https://www.highcharts.com/) + [Highcharts React Official](https://github.com/highcharts/highcharts-react)
- [Recharts](https://recharts.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started) + [Drei](https://github.com/pmndrs/drei)


📌 **Backend (Express)**

- [Express](https://expressjs.com/) (Asegurar que esté instalado si se usa)
- [PostgreSQL](https://www.postgresql.org/) (Base de Datos)
- [Sequelize](https://sequelize.org/) (ORM para Postgres)
- [JSON Web Token (JWT)](https://jwt.io/) para autenticación


📌 **Herramientas de Desarrollo**

- [Vite](https://vitejs.dev/)
- [ESLint](https://eslint.org/) + [Plugins para React](https://github.com/jsx-eslint/eslint-plugin-react)
- [PostCSS](https://postcss.org/) + [Autoprefixer](https://github.com/postcss/autoprefixer)


# ⚙️ Instalación y Configuración

## 1️⃣ Clonar el repositorio
![Captura desde 2025-03-27 13-06-31](https://github.com/user-attachments/assets/dead32cb-4b5e-429a-aabd-fe039a78ea50)

## 2️⃣ Instalar dependencias
![Captura desde 2025-03-27 13-09-20](https://github.com/user-attachments/assets/15156b8b-a6bf-4a95-af8d-75ecc67a90af)

- Si el proyecto tiene backend, instala también las dependencias en la carpeta correspondiente.

## 3️⃣ Configurar variables de entorno
![Captura desde 2025-03-27 13-10-34](https://github.com/user-attachments/assets/de9062e6-1944-427e-9303-3a5cde341c26)

- Si usas autenticación, agrega las claves necesarias para Firebase, Auth0 u otro proveedor.

- Creación del archivo .env, que es donde se escribirá la lógica de la conexión a la base de datos.
- 
![Captura desde 2025-03-27 13-18-16](https://github.com/user-attachments/assets/004481f2-62bb-449d-8eaa-565a1b1a5a60)


## 4️⃣ Ejecutar el Proyecto
### 🚀 Frontend (React + Vite)
![Captura desde 2025-03-27 13-11-57](https://github.com/user-attachments/assets/935a06b9-297d-4a36-a742-23b52eba933b)

### 🚀 Backend (Express) (si aplica)
![Captura desde 2025-03-27 13-12-41](https://github.com/user-attachments/assets/5ba716a7-f6f3-4ff7-baad-b704f34991a6)

- 🚀 El programa cuando se hace la consulta al backend sobre la ruta: http://localhost:5000/api/nombre-archivo-grafica, nos
  mostrará resultado de las consultas en formato Json, ya que es un formato muy adecuado para la entrega de datos y su posterior
  consumo desde el frontend.


# 🛠️ Comandos Útiles
![Captura desde 2025-03-27 13-13-39](https://github.com/user-attachments/assets/44fda2d0-e841-4c3e-a1a2-f3866dc79c40)


# 📝 Contribución
1. Realiza un fork del repositorio
2. Crea una nueva rama (feature/nueva-funcionalidad)
3. Haz un commit (git commit -m "Agrega nueva funcionalidad")
4. Envía un pull request 🚀


📄 Licencia

### Este proyecto está bajo la licencia [MIT](https://opensource.org/licenses/MIT). Puedes usarlo y modificarlo libremente. Usalo con sabiduría y ética.🎯


# 🛠 Errores Comunes y Soluciones

### 🔹 1. Error: "Module not found" en React
- 📌 Problema: Al importar un componente o módulo, aparece un error de que no se encuentra.
✅ Solución:
  - Asegúrate de que la importación tiene la ruta correcta.
  - Si usas imports absolutos en Vite, revisa la configuración en `vite.config.js`:
    ![Captura desde 2025-03-27 13-59-52](https://github.com/user-attachments/assets/ce976337-8403-4ac5-96c3-f728cca392c4)


### 🔹 2. Error: "CORS policy: No 'Access-Control-Allow-Origin'"
- 📌 Problema: El frontend no puede hacer peticiones al backend porque el servidor bloquea las solicitudes por CORS.
✅ Solución:
  - En Express, instala y usa `cors`:
    ![Captura desde 2025-03-27 14-01-23](https://github.com/user-attachments/assets/facc5a35-2e9c-4305-901c-96fc6b18c35f)

  - Luego, en `server.js` o `app.js`:
    ![Captura desde 2025-03-27 14-02-36](https://github.com/user-attachments/assets/76c9d4d5-b53a-48b7-bb90-9b5d43c4c41f)


### 🔹 3. Error: "React Hook useEffect has a missing dependency"
- 📌 Problema: Aparece un warning porque falta una dependencia en `useEffect`.
✅ Solución:
  - Siempre incluye todas las dependencias necesarias:
    ![Captura desde 2025-03-27 14-08-46](https://github.com/user-attachments/assets/e6e84249-0cb9-498f-bb5c-62de86b79d99)

  - Si la función es externa, usa `useCallback` para evitar problemas de re-renderizado.


 ### 🔹 4. Error: "Highcharts is not defined" o "Chart.js not rendering"
 - 📌 Problema: La gráfica no se renderiza o aparece un error de que no encuentra la librería.
✅ Solución:
  - Asegúrate de importar correctamente `Highcharts` o `Chart.js`:
    ![Captura desde 2025-03-27 14-10-53](https://github.com/user-attachments/assets/f4b892c7-b088-45c8-9336-07a9eb95dbe0)

  - Para `Chart.js`, recuerda registrar los componentes:
    ![Captura desde 2025-03-27 14-11-38](https://github.com/user-attachments/assets/522565ae-32b2-4369-bcaf-640e3bb676ef)


### 🔹 5. Error: "Cannot read properties of undefined (reading 'map')"
- 📌 Problema: Se intenta hacer `.map()` en una variable que es `undefined`.
✅ Solución:
  - Asegúrate de que el **estado o la variable están definidos** antes de usarlos:
    ![Captura desde 2025-03-27 14-13-41](https://github.com/user-attachments/assets/34365a26-2fe2-44b0-a5fc-b0ff8e392c02)

  - Usa `useState([])` en lugar de `useState(null)` para inicializar el estado vacío.
 

### 🔹 6. Error: "UnhandledPromiseRejection: Connection refused to PostgreSQL"
- 📌 Problema: Express no puede conectarse a la base de datos PostgreSQL.
✅ Solución:
  - Asegúrate de que PostgreSQL está corriendo (`systemctl status postgresql`).
  - Verifica las credenciales en el archivo `.env`:
    ![Captura desde 2025-03-27 14-19-11](https://github.com/user-attachments/assets/c569f0fb-4948-49bf-b114-206548af743a)


### 🔹 7. Error: "SequelizeDatabaseError: relation does not exist"
- 📌 Problema: Sequelize no encuentra una tabla en la base de datos.
✅ Solución:
  - Ejecuta las migraciones nuevamente:
    ![Captura desde 2025-03-27 14-21-15](https://github.com/user-attachments/assets/f2522287-c4c1-4fd5-9d65-da210ade4d60)

  - Asegúrate de que `sync() está configurado correctamente:














