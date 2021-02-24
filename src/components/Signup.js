import React from 'react';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';

let renderCount = 0;

class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name:'',
			email:'',
			password:'',
			gender:''
		};
		this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
		this.validator = new SimpleReactValidator({className : "text-danger"});
		console.log(this.validator);

		//const renderCount = 0;
	}

	handleChange(event) {
		this.setState({[event.target.id] : event.target.value});
	}

	handleSubmit(event) {
		if (this.validator.allValid()) {
			let data = this.state;
			alert('You submitted the form and stuff!');
			axios.post({
				url: '/signup',
				data: data,

			}).then(function (response) {
				console.log(response);
			}).catch(function (error) {
				if (error.response) {
					alert('There is an error on ajax call.');
				  // The request was made and the server responded with a status code
				  // that falls out of the range of 2xx
				  console.log(error.response.data);
				  console.log(error.response.status);
				  console.log(error.response.headers);
				} else if (error.request) {
				  // The request was made but no response was received
				  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				  // http.ClientRequest in node.js
				  console.log(error.request);
				} else {
				  // Something happened in setting up the request that triggered an Error
				  console.log('Error', error.message);
				}
				console.log(error.config);
			});
		} else {
			this.validator.showMessages();
			// rerender to show messages for the first time
			// you can use the autoForceUpdate option to do this automatically`
			this.forceUpdate();
		}
		// console.log(this.state);
		// alert('A name was submitted: ' + this.state.name);
		event.preventDefault();
	}


	render() {
		renderCount++;
		return ( 
		<div class="row">
			<div class="col-md-6 offset-md-3">
				<h2 class="text-center">User Registration</h2>
				<form style={{marginTop:"20px"}} onSubmit={this.handleSubmit}>
					<div class="form-group">
						<label for="name">Name</label>
						<input type="text" class="form-control" id="name" value={this.state.name} placeholder="" onChange={this.handleChange} />
						{this.validator.message('name', this.state.name, 'required|alpha', {
							messages: {
								required : "Name required.",
								alpha: "Name must be alpha"
							}
						})}
					</div>
					<div class="form-group">
						<label for="email">Email address</label>
						<input type="email" class="form-control" id="email" value={this.state.email} placeholder="name@example.com" onChange={this.handleChange} />
						{this.validator.message('email', this.state.email, 'required|email')}
					</div>
					<div class="form-group">
						<label for="password">Password</label>
						<input type="password" class="form-control" id="password" value={this.state.password} onChange={this.handleChange} />
						{this.validator.message('password', this.state.password, 'required|min:8|max:16')}
					</div>
					<div class="form-group">
						<label for="gender">Gender</label>
						<select class="form-control" id="gender" onChange={this.handleChange}>
							<option value="">Select</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
						{this.validator.message('gender', this.state.gender, 'required')}
					</div>
					<button type="submit" class="btn btn-primary">Save {renderCount}</button>
				</form>
			</div>
		</div>
		);
	}
}

export default Signup;