import React from 'react';

import http from '../services/Request';

import { withAlert } from 'react-alert';

import SimpleReactValidator from 'simple-react-validator';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

class Policy extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.id,
			name: '',
			access_level: '',
			all_action: false,
			selected_action: [{ value: 's3:DeleteBucket', label: 'DeleteBucket' }],
		};

		this.policy = {};
		
		this.validator = new SimpleReactValidator({className : "text-danger"});
		this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
		this.onValueChange = this.onValueChange.bind(this);

		//this.actions = ['AbortMultipartUpload', 'CreateBucket', 'DeleteBucket', 'ForceDeleteBucket', 'DeleteBucketPolicy', 'DeleteObject', 'GetObject', 'ListAllMyBuckets', 'ListBucket'];

		this.actions = [
			{ value: 's3:AbortMultipartUpload', label: 'AbortMultipartUpload' },
			{ value: 's3:CreateBucket', label: 'CreateBucket' },
			{ value: 's3:DeleteBucket', label: 'DeleteBucket' },
			{ value: 's3:ForceDeleteBucket', label: 'ForceDeleteBucket' },
			{ value: 's3:DeleteBucketPolicy', label: 'DeleteBucketPolicy' },
			{ value: 's3:DeleteObject', label: 'DeleteObject' },
			{ value: 's3:GetObject', label: 'GetObject' },
			{ value: 's3:ListAllMyBuckets', label: 'ListAllMyBuckets' },
			{ value: 's3:ListBucket', label: 'ListBucket' }
		]

		//this.defaultValue = [{ value: 's3:DeleteBucket', label: 'DeleteBucket' }];

		//this.selectedValue = ['DeleteBucket'];

	}

	componentDidMount() {
		//this.get_user();
	}

	async handleSubmit(event) {
		await this.generate();
		const _alert = this.props.alert;
		if (!this.validator.allValid()) {
			this.validator.showMessages();
			// rerender to show messages for the first time
			// you can use the autoForceUpdate option to do this automatically`
			this.forceUpdate();
		} else {
			let data = {
				name: this.state.name,
				policy: this.policy,
			};
			http.post(`/s3/policy`,
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
		// this.setState(prevState => ({
		// 	Form: {
		// 	  ...prevState.Form,
		// 	  [name]: value,
		// 	}
		//   }));
		console.log(this.state);
	}

	onValueChange(event) {
		console.log(event.target)
		if(event.target.name === 'access_level') {
			this.setState({
				access_level: event.target.value
			});
		} else if(event.target.name === 'all_action') {
			this.setState({
				all_action: !this.state.all_action
			});
			if(event.target.checked) {

			}
		}

		// console.log(this.state);
		
	}

	changeSelect(selected) {
		//console.log(selected);
		this.setState({selected_action: selected});
	}

	generate() {
		console.log(this.validator.allValid());
		if (!this.validator.allValid()) {
			this.validator.showMessages();
			// rerender to show messages for the first time
			// you can use the autoForceUpdate option to do this automatically`
			this.forceUpdate();
			console.log(1);
			return false;
		}

		//alert();

		let temp={};
		temp['Name'] = this.state.name;
		temp['Version'] = "2012-10-17";
		temp['Statement'] = []
		let statement = {}
		statement['Effect'] = this.state.access_level

		if(this.state.all_action) {
			let temp = [];
			let tmp = 's3:*';
			temp.push(tmp);
			statement['Action'] = temp;
		} else {
			if(this.state.selected_action.length > 0) {
				var sel_val = [];
				this.state.selected_action.forEach((val, key) => {
					sel_val.push(val.value);
				})
				statement['Action'] = sel_val
				console.log(sel_val);
				// let action = this.state.selected_action.join(',');
				console.log(this.state.selected_action)
				//console.log(action)
			}
		}

		statement['Resource'] = this.state.resources;

		temp['Statement'].push(statement);

		this.policy = temp;

		this.setState({policy: temp});

		console.log(this.policy)
		return true;
	}

	conditional_validation() {
		if(!this.state.all_action) {

			if(this.state.selected_action.length == 0) {
				return this.validator.message('actionss', this.state.selected_action, 'required', {
					messages: {
						required : "Action required.",
					}
				})
			}
			
		}
		
	}

	
	render () {
		this.validator.purgeFields();
		return (
			<>
			<div className="row">
				<div className="col-md-6 offset-md-3">
					<h2 className="text-center">User Policy</h2>
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

						<div style={{"background":"rgb(244, 244, 244)", "padding":"20px 20px", "border-radius": "10px"}}>
						
						<div className="form-group row">
							<label className="col-sm-4 col-form-labela font-weight-bold">Access level</label>
							<div class="col-sm-8">
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="radio" name="access_level" id="inlineRadio1" value="Allow" checked={this.state.access_level === "Allow"} onChange={this.onValueChange} />
									<label class="form-check-label" for="inlineRadio1">Allow</label>
								</div>
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="radio" name="access_level" id="inlineRadio2" value="Deny" checked={this.state.access_level === "Deny"} onChange={this.onValueChange} />
									<label class="form-check-label" for="inlineRadio2">Deny</label>
								</div>
								{this.validator.message('access_level', this.state.access_level, 'required', {
									messages: {
										required : "Access level required.",
									}
								})}
							</div>
							
						</div>

						<div className="form-group row">
							<label className="col-sm-12 font-weight-bold" htmlFor="">Actions</label>
							<div class="col-sm-9">
								{/* <select className="form-control" id="action" value={this.state.action} onChange={this.handleChange}>
									<option value="">Select</option>
								</select> */}
								<Select
									closeMenuOnSelect = {false}
									components = {animatedComponents}
									defaultValue = {this.state.selected_action}
									isMulti
									options = {this.actions}
									onChange = {this.changeSelect.bind(this)}
									isDisabled = {this.state.all_action}
									//defaultValue={this.actions.filter(({value}) => value.value === this.selectedValue)}
								/>
								
								{ this.conditional_validation() }
							</div>
							<div class="col-sm-3 col-form-label">
								<input class="form-check-input" type="checkbox" name="all_action" id="all_action" defaultChecked={this.state.all_action} onChange={this.onValueChange}  />
								<label class="form-check-label" for="all_action">All Actions</label>
							</div>
							
						</div>

						<div className="form-group">
							<label htmlFor="resources" className="font-weight-bold">Resources</label>
							<input type="text" className="form-control" name="resources" id="resources" value={this.state.resources} onChange={this.handleChange} />
							{this.validator.message('resources', this.state.resources, ['required', {regex: "^arn:(?:aws|minio):s3:::[a-z0-9\.\-\/\*]+(,\s?arn:(?:aws|minio):s3:::[a-z0-9\.\-\/\*]+){0,}$"}], {
								messages: {
									required : "Resources required.",
									regex : "Resources must be in below pattern.",
								}
							})}
							
						
							<small class="form-text text-muted">We should mention bucket or path (should be start with "arn:aws:s3:::" and multiple resources must be seperated by ",")</small>
						</div>
						</div>
						
						{/* <div className="form-group">
							<label htmlFor="gender">Buckets</label>
							<select className="form-control" id="bucket" value={this.state.bucket} onChange={this.handleChange}>
								<option value="">Select</option>
							</select>
						</div> */}
						<div className="form-group">
							<button type="button" className="btn btn-sm btn-primary" onClick={this.generate.bind(this)}>Generate</button>
						</div>
						<div className="form-group">
							<textarea className="form-control" value={JSON.stringify(this.state.policy, null, 2)}></textarea>
						</div>
											
						<button type="submit" className="btn btn-primary">Save</button>
						<button type="button" className="btn btn-danger" onClick={this.props.history.goBack}>Cancel</button>
					</form>

					
				</div>
			</div>
			
			
			</>
		);
	}
}

//export default Policy;
export default withAlert()(Policy);