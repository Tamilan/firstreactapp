import React from 'react';
import axios from 'axios';

const config = {
	baseURL: 'http://localhost:3001'
}

// export const request = {

// }

// function name(params) {
	
// }

export default function Request(params) {
	const instance = axios.create({
		baseURL: config.baseURL,
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/json',
		},
	});

	return instance;
}

class Request_ extends React.Component {

	constructor(props) {
		super(props);

		this.instance = axios.create({
			baseURL: config.baseURL,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json',
			},
		});
	}

	init() {
		
	
	}

	post(option) {
		const {url, params, ...options} = option;
		console.log(url);
		console.log(params);
		console.log(options);

		this.instance.post(url, {
			params: params
		}).then(function (response) {
			console.log(response);
			let user_data = response.data;
			// localStorage.setItem('currentUser', JSON.stringify(user_data));
			// currentUserSubject.next(user_data);
		  })
		  .catch(function (error) {
			alert(123);
			console.log(error);
		  })
		  .then(function () {
			// always executed
		  });
		
	}


}

//export default Request;