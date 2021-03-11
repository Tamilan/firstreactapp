//import React from 'react';
import axios from 'axios';
import { authenticationService } from "./authenticationService";


import LocalStorageService from "./LocalStorageService";
//import router from "./router/router";
import { history } from '../helpers/history';

const config = {
	baseURL: 'http://localhost:3001'
}

//export default axios.create({
const axiosInstance = axios.create({
	baseURL: config.baseURL,
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/json',
		//'Authorization': 'bearer ' + authenticationService.get_token()
	},
});




// LocalstorageService
const localStorageService = LocalStorageService.getService();

// Add a request interceptor
axiosInstance.interceptors.request.use(
	config => {
		const token = localStorageService.getAccessToken();
		if (token) {
			config.headers['Authorization'] = 'Bearer ' + token;
		}
		// config.headers['Content-Type'] = 'application/json';
		return config;
	},
	error => {
		Promise.reject(error)
	});



//Add a response interceptor

axiosInstance.interceptors.response.use((response) => {
   return response
}, function (error) {
   const originalRequest = error.config;

   console.log(originalRequest.url)
	if (error.response.status === 401 && originalRequest.url === '/auth/token') {
		//router.push('/login');
		history.push('/login');

		authenticationService.logout();
		
		return Promise.reject(error);
	}

	if (error.response.status === 401 && !originalRequest._retry) {

		originalRequest._retry = true;
		const refreshToken = localStorageService.getRefreshToken();
		return axiosInstance.post('/auth/token',
			{
				"refresh_token": refreshToken
			})
			.then(res => {
				if (res.status === 201) {
					localStorageService.setToken(res.data);
					axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + localStorageService.getAccessToken();
					//return axios(originalRequest);
					return axiosInstance(originalRequest);
				}
			})
	}
	return Promise.reject(error);
});

export default axiosInstance;





// export default function Request(params) {
// 	const instance = axios.create({
// 		baseURL: config.baseURL,
// 		headers: {
// 			'X-Requested-With': 'XMLHttpRequest',
// 			'Content-Type': 'application/json',
// 		},
// 	});

// 	return instance;
// }

// class Request_ extends React.Component {

// 	constructor(props) {
// 		super(props);

// 		this.instance = axios.create({
// 			baseURL: config.baseURL,
// 			headers: {
// 				'X-Requested-With': 'XMLHttpRequest',
// 				'Content-Type': 'application/json',
// 			},
// 		});
// 	}

// 	init() {
		
	
// 	}

// 	post(option) {
// 		const {url, params, ...options} = option;
// 		console.log(url);
// 		console.log(params);
// 		console.log(options);

// 		this.instance.post(url, {
// 			params: params
// 		}).then(function (response) {
// 			console.log(response);
// 			let user_data = response.data;
// 			// localStorage.setItem('currentUser', JSON.stringify(user_data));
// 			// currentUserSubject.next(user_data);
// 		  })
// 		  .catch(function (error) {
// 			alert(123);
// 			console.log(error);
// 		  })
// 		  .then(function () {
// 			// always executed
// 		  });
		
// 	}


// }

//export default Request;