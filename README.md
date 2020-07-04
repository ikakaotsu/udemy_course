# Udemy_Course

Creado por [Nicolas Schurmann](https://www.udemy.com/share/102XRmA0Edd11aRHo=/)

## Overview
Curso de Udemy JavaScript ES9, CSS3, HTML, NODEJS
El cuso usa una API Rest Serverless con [Vercel](https://vercel.com) donde utiliza una Arqutectura de dos capas (cliente/servidor) [Mongodb]( https://www.mongodb.com) como base de datos.

El programa es una negocio que posee comidas(Meals) donde se seleccionan para formar una lista de Ordenes(Orders) de las distintas comidas.
### Carpeta API 
Posee toda la logica del programa (Request - Response - Authorization). 

Vercel 
1. Crear un directorio 'api' en el directorio raiz del proyecto. Por defecto no es necesario ninguna configuracion para desplegar funciones Serverless
2. Crear archivo de configuracion now.json 
{
	version: 2,
	name: udemy_course,
	routes: [
		{src: /api/(.*), dest: /serverless/api/index.js}
	],
	env:{
		MONGODB_URI: @mongodb-uri
	}
}
3. Ejecutar npm init -y el cual crea package.json para asi agregar las dependencias(modules) a él.
4. Instalar dependencias npm i -S express mongoose body-parser cors jsonwebtoken

### Contenido Carpetas
1. Carpeta api
- index.js Contine conexión y modelado a mongodb a travez de mongoose, express para crear servidor local si es necesario y body-parser como middleware . CORS para Control de Acceso HTTP de las rutas

2. Carpeta api -> auth
- index.js 
Usa una implementacion de JSON Web Tokens como asi tambien los roles permitidos en la aplicacion

3. Carpeta api -> models (Modelos de la BD)
- Meals.js
- Orders.js
- Users.js

4. Carpeta api -> routers
- auth.js Posee los direccionamiento tanto para el registro de usuario(/register, el inicio de sesion(login) y un direccionamiento que devuelve el usuario autorizado.

- meals.js Posee los direccionamientos Get--Put-Delete usando id Usuario. El Handler post crea una nueva Comida(Meal)

- orders.js Posee los direccionamientos Get--Put-Delete usando id Usuario. El Handler post crea una nueva Orden(Order) junto con el id del usuario.

