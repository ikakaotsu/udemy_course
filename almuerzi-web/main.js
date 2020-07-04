let mealsState = []
let ruta = 'login' // login, register, orders
let userid = {}

const stringToHTML = (s) => {
	const parser = new DOMParser()
	const doc = parser.parseFromString(s, 'text/html')

	return doc.body.firstChild
}

const renderItem = (item) => {
	const element = stringToHTML(`<li data-id="${item._id}">${item.name}</li>`)

	element.addEventListener('click', () => {
		const mealsList = document.getElementById('meals-list')
		Array.from(mealsList.children).forEach(x => x.classList.remove('selected'))
		element.classList.add('selected')
		const mealsIdInput = document.getElementById('meals-id')
		mealsIdInput.value = item._id
	})
	return element
}

const renderOrder = (order, meals) => {
	const meal = meals.find(meal => meal._id === order.meal_id)
	const element = stringToHTML(`<li data-id="${order._id}"><span>${meal.name} - ${order.user_id}</span></li>`)

	element.addEventListener('click', () => {
		const ordersList = document.getElementById('orders-list')
		Array.from(ordersList.children).forEach(x => x.classList.remove('chosen-one'))
		element.classList.add('chosen-one')
		const orderIdInput = document.getElementById('order-id')
		orderIdInput.value = order._id
	})
	return element
}

const deleteOreders = () => {
	const delform = document.getElementById('del-orders')
	delform.onsubmit = (e) => {
		e.preventDefault()
		//	const delsubmit = document.getElementById('del-submit')
		const orderId = document.getElementById('order-id')
		const orderIdValue = orderId.value
		if (!orderIdValue) {
			alert('Debe seleccionar una Orden')
			return
		}

		fetch('https://udemy-course.ikakaotsu.now.sh/api/orders/=id=' + orderIdValue, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('token'),
			},
		}).then(response => {
			const selectorder = document.querySelector('.chosen-one')
			selectorder.remove()
			return response.status
		})
	}
}

const inicializarFormulario = () => {

	const orderForm = document.getElementById('order')
	orderForm.onsubmit = (e) => {
		e.preventDefault()
		const submit = document.getElementById('submit')
		submit.setAttribute('disabled', true)
		const mealId = document.getElementById('meals-id')
		const mealIdValue = mealId.value
		if (!mealIdValue) {
			alert('Debe seleccionar un plato')
			submit.removeAttribute('disabled')
			return
		}
		const order = {
			meal_id: mealIdValue,
			user_id: userid,
		}

		fetch('https://udemy-course.ikakaotsu.now.sh/api/orders', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: localStorage.getItem('token'),
			},
			body: JSON.stringify(order)
		}).then(x => x.json())
			.then(respuesta => {
				const renderedOrder = renderOrder(respuesta, mealsState)
				const ordersList = document.getElementById('orders-list')
				ordersList.appendChild(renderedOrder)
				submit.removeAttribute('disabled')
			})
	}
}

const inicializarDatos = () => {

	fetch('https://udemy-course.ikakaotsu.now.sh/api/meals')
		.then(response => response.json())
		.then(data => {
			mealsState = data
			const mealsList = document.getElementById('meals-list')
			const submit = document.getElementById('submit')
			const listItems = data.map(renderItem)
			mealsList.removeChild(mealsList.firstElementChild)
			listItems.forEach(element => mealsList.appendChild(element))
			submit.removeAttribute('disabled')
			fetch('https://udemy-course.ikakaotsu.now.sh/api/orders', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					authorization: localStorage.getItem('token'),
				},
			})
				.then(response => response.json())
				.then(ordersData => {
					const ordersList = document.getElementById('orders-list')
					const listOrders = ordersData.map(orderData => renderOrder(orderData, data))
					ordersList.removeChild(ordersList.firstElementChild)
					listOrders.forEach(element => ordersList.appendChild(element))
				})
		})
}

/* Redirecciona Rutas Webs */
const renderApp = () => {
	const token = localStorage.getItem('token')
	if (token) {
		userid = JSON.parse(localStorage.getItem('userid'))
		return renderOrders()
	}
	renderLogin()
}

const renderOrders = () => {

	const ordersView = document.getElementById('orders-view')
	document.getElementById('app').innerHTML = ordersView.innerHTML

	inicializarFormulario()
	inicializarDatos()
	deleteOreders()
}

const renderLogin = () => {
	const loginTemplate = document.getElementById('login-template')
	document.getElementById('app').innerHTML = loginTemplate.innerHTML
	const loginForm = document.getElementById('login-form')
	loginForm.onsubmit = (e) => {
		e.preventDefault()
		const email = document.getElementById('email').value
		const password = document.getElementById('password').value

		fetch('https://udemy-course.ikakaotsu.now.sh/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({email, password})
		}).then(x => x.json())
			.then(respuesta => {
				localStorage.setItem('token', respuesta.token)
				ruta = 'orders'
				return respuesta.token
			})
			.then(token => {
				return fetch('https://udemy-course.ikakaotsu.now.sh/api/auth/me', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						authorization: token,
					},
				})
			})
			.then(x => x.json())
			.then(fetchedUser => {
				localStorage.setItem('userid', JSON.stringify(fetchedUser._id))
				userid = fetchedUser
				renderOrders()
			})
	}
}

window.onload = () => {
	renderApp()
}
