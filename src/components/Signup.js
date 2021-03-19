import React from 'react';
import SimpleReactValidator from 'simple-react-validator';
import http from '../services/Request';
import { withAlert } from 'react-alert';

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

		//this.request = new Request();
		//const renderCount = 0;
	}

	handleChange(event) {
		this.setState({[event.target.id] : event.target.value});
	}

	reset_form() {
		this.setState({
			name:'',
			email:'',
			password:'',
			gender:''
		})
		console.log('reset')
	}

	handleSubmit(event) {
		const _alert = this.props.alert;
		if (!this.validator.allValid()) {
			this.validator.showMessages();
			// rerender to show messages for the first time
			// you can use the autoForceUpdate option to do this automatically`
			this.forceUpdate();
		} else {
			let data = this.state;
			http.post("/signup",
			{
				params: data
			}).then(response => {
				let data = response.data;
				_alert.success(data.message);
				this.reset_form();
				this.validator.hideMessages();
				console.log(data);
				// if(data.status!=undefined) {
				// 	switch (data.status) {
				// 		case 'success':
				// 			_alert.success(data.message);
				// 			this.reset_form();
				// 			break;
					
				// 		default:
				// 			_alert.error(data.message);
				// 			break;
				// 	}
				// }
			}).catch(function (error) {
				if (error.response) {

					let data = error.response.data

					if(data.message!=undefined) {
						_alert.error(data.message);
					}
					//alert('There is an error on ajax call.');
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					console.log(error.response.data);
					console.log(error.response.status);
					console.log(error.response.headers);
				} else if (error.request) {
					console.log(error.request);
				} else {
					// Something happened in setting up the request that triggered an Error
					console.log('Error', error.message);
				}
				console.log(error.config);
			});
			
		}
		// console.log(this.state);
		// alert('A name was submitted: ' + this.state.name);
		event.preventDefault();
	}


	render() {
		//renderCount++;
		return ( 
		<div className="row">
			<div className="col-md-6 offset-md-3">
				<h2 className="text-center">User Registration</h2>
				<form style={{marginTop:"20px"}} onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label htmlFor="name">Name</label>
						<input type="text" className="form-control" id="name" value={this.state.name} placeholder="" onChange={this.handleChange} />
						{this.validator.message('name', this.state.name, 'required|alpha', {
							messages: {
								required : "Name required.",
								alpha: "Name must be alpha"
							}
						})}
					</div>
					<div className="form-group">
						<label htmlFor="email">Email address</label>
						<input type="email" className="form-control" id="email" value={this.state.email} placeholder="name@example.com" onChange={this.handleChange} />
						{this.validator.message('email', this.state.email, 'required|email')}
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input type="password" className="form-control" id="password" value={this.state.password} onChange={this.handleChange} />
						{this.validator.message('password', this.state.password, 'required|min:8|max:16')}
					</div>
					<div className="form-group">
						<label htmlFor="gender">Gender</label>
						<select className="form-control" id="gender" value={this.state.gender} onChange={this.handleChange}>
							<option value="">Select</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
						{this.validator.message('gender', this.state.gender, 'required')}
					</div>
					<button type="submit" className="btn btn-primary">Submit</button>
				</form>
			</div>
		</div>
		);
	}
}

//export default Signup;
export default withAlert()(Signup);