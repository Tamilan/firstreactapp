import React from 'react';
import { withAlert } from 'react-alert';
import SimpleReactValidator from 'simple-react-validator';
import http from '../services/Request';
import { Modal, Button } from 'react-bootstrap';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


class Profile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			name:'',
			email:'',
			gender:'',
			mfa: false,
			modalShowHide : false,
			QR_img_data:'',
			code:'',
			
		}
		this.validator = new SimpleReactValidator({className : "text-danger"});
		this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChangeMFA = this.handleChangeMFA.bind(this);
	}

	componentDidMount() {

		const _alert = this.props.alert;
		http.get("/profile")
		.then(response => {
			let data = response.data;

			this.setState(data);

			document.getElementById("mfa").checked = data.mfa;
			
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
			http.post("/profile",
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

	handleChangeMFA(event) {
		if(event.target.checked) {
			this.generate_qr();
		} else {
			if(this.state.mfa) {
				confirmAlert({
					title: 'Attention',
					message: 'Are you sure want to disable MFA.',
					buttons: [
					  {
						label: 'Yes',
						onClick: () => {
							this.disable_mfa();
						}
					  },
					  {
						label: 'No',
						onClick: () => {
							document.getElementById("mfa").checked = true;
						}
					  }
					]
				});
			}
		}

	}

	disable_mfa = () => {
		const _alert = this.props.alert;
		http.delete("/disable_mfa")
		.then(response => {
			let data = response.data;
			console.log(data);
			
		}).catch(function (error) {
			if (error.response) {

				let data = error.response.data

				if(data.message!=undefined) {
					_alert.error(data.message);
				}
				console.log(error.response.data);
			} else if (error.request) {
				console.log(error.request);
			} else {
				console.log('Error', error.message);
			}
			console.log(error.config);
		});
	}

	handleModalShowHide() {
        this.setState({ modalShowHide: !this.state.modalShowHide })
    }

	handleModelClose = event => {
		console.log('model closed');
	}

	generate_qr() {
		const _alert = this.props.alert;
		http.get("/generate-qr")
		.then(response => {
			let data = response.data;
			this.setState({QR_img_data: data.dataURL})
			this.handleModalShowHide()
			console.log(data);
			
		}).catch(function (error) {
			if (error.response) {

				let data = error.response.data

				if(data.message!=undefined) {
					_alert.error(data.message);
				}
				console.log(error.response.data);
			} else if (error.request) {
				console.log(error.request);
			} else {
				console.log('Error', error.message);
			}
			console.log(error.config);
		});
	}

	verify_mfa = () => {
		const _alert = this.props.alert;
		http.post("/verify-mfa", {token: this.state.code})
		.then(response => {
			let data = response.data;
			
			_alert.success(data.message);
			this.setState({mfa: true});
			this.handleModalShowHide()
			console.log(data);
			
		}).catch(function (error) {
			if (error.response) {

				let data = error.response.data

				if(data.message!=undefined) {
					alert(data.message);
				}
				console.log(error.response.data);
			} else if (error.request) {
				console.log(error.request);
			} else {
				console.log('Error', error.message);
			}
			console.log(error.config);
		});
	}

	render() {
		return (
			<>
			<Modal show={this.state.modalShowHide} onHide={this.handleModelClose} backdrop="static">
				<Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
					<Modal.Title>Enable MFA</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form style={{marginTop:"20px"}}>
						
						<div className="form-group text-center">
							<img src={this.state.QR_img_data} alt="QR Code" />
    						
						</div>
						<div className="form-group">
							<label>Authenticator Code</label>
							<input type="text" className="form-control" id="code" value={this.state.code} placeholder="" onChange={this.handleChange} />
						</div>
						
					</form>
				</Modal.Body>
				<Modal.Footer>
				<Button variant="secondary" onClick={() => this.handleModalShowHide()}>
					Cancel
				</Button>
				<Button variant="primary" disabled={this.state.fileupload_in_progress} onClick={() => this.verify_mfa()}>
					Verify
				</Button>
				</Modal.Footer>
			</Modal>

			<div className="row">
				<div className="col-md-6 offset-md-3">
					<h2 className="text-center">Profile</h2>
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
							<div class="custom-control custom-switch">
								<input type="checkbox" class="custom-control-input" id="mfa" onChange={this.handleChangeMFA} />
								<label class="custom-control-label" for="mfa">MFA</label>
							</div>
						</div>

						<button type="submit" className="btn btn-primary">Submit</button>
					</form>
				</div>
			</div>
			</>
		);
	}
}

export default withAlert()(Profile);