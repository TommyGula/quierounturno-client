# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

Para editar:

<!-- 1) Agregar el signo de cierre al modal de login
2) Poner en 2 columnas (izq cartel de texto, der el video) toda la home -->
3) En la home poner el buscador como un selector
<!-- 4) Los botones del header solo aparecen en Home (quiero ofrecer y quiero buscar) -->
5) Para las monedas ver los medios de pago de la api de Mercadopago
6) Depende de la ubicación que pusiste en el mapa, que te aparezca tu moneda y la opción USD
7) Al crear un negocio, automáticamente se carga con el usuario como un trabajador, con todos los derechos de administrador total
8) Modal de Info (i) al lado de cada título de Crear negocio / servicio / perfil etc. Que al clickearlo salte un modal con información de cómo cargar todo correctamente

2024-01-12

- Que en la vista semanal salga del día actual en adelante
- En la vista mensual, al apretar el día, que te lleve a la vista semanal/diaria
- El selector de fecha de la vista diaria que parezca un botón y tenga el símbolo del calendario
- Ver bug del paymentMethod
- Al agendar un turno, que salte un Popup con el resumen del turno y un campo para poner tu teléfono para recibir notificaciones
- Las notificaciones se envían 2 y 1 días antes del turno (por mail y teléfono si se registró)
------------------
- Hacer que el turno aparezca como tomado cuando ya está tomado
- Arreglar para que el turno aparezca en la agenda personal

- En Agenda.js el firstHour y lastHour tienen que ser sí o sí con los datos del currentDate