import React from 'react';
import {FaTrash} from 'react-icons/fa';

import http from '../services/Request';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { withAlert } from 'react-alert';

import { Link } from "react-router-dom";
import SimpleReactValidator from 'simple-react-validator';


class Users extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.id,
			name: '',
			email: '',
			gender: '',
		};
		this.validator = new SimpleReactValidator({className : "text-danger"});
		this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.get_user();
	}

	get_user() {
		http.get(`/user/${this.state.id}`,{

		})
		.then(res => {
			let response = res.data;
			console.log(response);
			this.setState(response);
		
			console.log(this.state);
		}).catch( err => {
			console.log(err);
		});
	}

	handleSubmit(event) {
		const _alert = this.props.alert;
		if (!this.validator.allValid()) {
			this.validator.showMessages();
			// rerender to show messages for the first time
			// you can use the autoForceUpdate option to do this automatically`
			this.forceUpdate();
		} else {
			let data = {
				name: this.state.name,
				gender: this.state.gender,
			};
			http.post(`/user/${this.state.id}`,
			data
			).then(response => {
				let data = response.data;
				_alert.success(data.message);
				this.reset_form();
				this.validator.hideMessages();
				console.log(data);
				
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

	handleChange(event) {
		this.setState({[event.target.id] : event.target.value});
	}

	
	render () {
		return (
			<>
			<div className="row">
				<div className="col-md-6 offset-md-3">
					<h2 className="text-center">User detail</h2>
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
							<input type="text" className="form-control" id="email" readOnly value={this.state.email} />
							{this.validator.message('email', this.state.email, 'required|email')}
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

						<div className="form-group">
							<label htmlFor="gender">Policy</label>
							<select className="form-control" id="gender" value={this.state.policy} onChange={this.handleChange}>
								<option value="">Select</option>
								<option value="p1">Policy 1</option>
								<option value="p2">Policy 2</option>
							</select>

							<a className="float-right" href="/policy">Add Policy</a>
						</div>
						
						<button type="submit" className="btn btn-primary">Submit</button>
						<button type="button" className="btn btn-danger" onClick={this.props.history.goBack}>Cancel</button>
					</form>
				</div>
			</div>
			
			
			</>
		);
	}
}

//export default Users;
export default withAlert()(Users);