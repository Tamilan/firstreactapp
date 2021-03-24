import React from 'react';

import http from '../services/Request';

import { withAlert } from 'react-alert';

import SimpleReactValidator from 'simple-react-validator';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import {dogOptions, flavourOptions } from '../data'; 

const animatedComponents = makeAnimated();

let inputKey = 0;

class Policy extends React.Component {
	constructor(props) {
		super(props);
		console.log(this.props.match.params)
		this.state = {
			p_name: this.props.match.params.policy_name,
			name: '',
			Effect: '',
			Resource: '',
			//all_action: false,
			selected_action: [],
			selected_action_: [{ value: 's3:DeleteBucket', label: 'DeleteBucket' }],
			readonly: false
		};

		this.policy = {}
		this.policy_data = {}
		
		this.validator = new SimpleReactValidator({className : "text-danger"});
		this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
		this.onValueChange = this.onValueChange.bind(this);

		this.actions = ['s3:AbortMultipartUpload', 's3:CreateBucket', 's3:DeleteBucket', 's3:ForceDeleteBucket', 's3:DeleteBucketPolicy', 's3:DeleteObject', 's3:GetObject', 's3:ListAllMyBuckets', 's3:ListBucket'];

		this.actions_ = [
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
	}

	componentDidMount() {
		//this.get_user();
		//const { match: { params } } = this.props;
		console.log(this.props);
		if(this.state.p_name) {
			this.get_policy()
		}
		//console.log(this.state)
	}

	get_policy = () => {
		http.get(`/s3/policy/${this.state.p_name}`)
		.then(res => {
			const policy = res.data.data;
			this.policy_data = policy
			this.load_data(policy)
			console.log(policy);
		}).catch(error => {
			console.log(error)
		});
	}

	load_data = (data) => {
		
		this.setState({name: this.state.p_name, readonly:true});

		if(data['Statement'] != undefined) {
			if(data['Statement'].length > 0) {
				let p_data = {}
				if(data['Statement'][0]['Sid']!=undefined) {
					p_data['Sid'] = data['Statement'][0]['Sid']
				}

				if(data['Statement'][0]['Effect']!=undefined) {
					p_data['Effect'] = data['Statement'][0]['Effect']
				}

				if(data['Statement'][0]['Resource']!=undefined) {
					p_data['Resource'] = data['Statement'][0]['Resource']
				}

				if(data['Statement'][0]['Condition']!=undefined) {
					p_data['Condition'] = data['Statement'][0]['Condition']
				}

				if(data['Statement'][0]['Action']!=undefined) {
					let action = data['Statement'][0]['Action'];
					if(typeof action === 'object') {

						if(action.length > 0) {
							let skip = false
							for(var i=0; i<action.length; i++) {
								if(action[i] === 's3:*') {
									this.setState({all_action: true})
									skip = true
									break;
								}

							}
							if(!skip) {
								let reformed_action = action.map((v) => ({ value: v, label: v.replace(/s3:/, '')}))
								
								this.setState({selected_action: reformed_action})
							}
							
						} 
						// else {
						// 	//console.log(action[0]);
						// 	if(action[0] == 's3:*') {
						// 		//all_action
						// 		this.setState({all_action: true})
						// 	}
						// }

					}

				}
				

				this.setState(p_data);
				
			}
		}
		console.log(this.state);

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

			if(this.state.p_name) {
				data['update'] = true
			}
			http.post(`/s3/policy`,
			data
			).then(response => {
				let data = response.data;
				_alert.success(data.message);
				this.reset_form();
				//this.validator.hideMessages();
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
		if(event.target.name === 'Effect') {
			this.setState({
				Effect: event.target.value
			});
		} else if(event.target.name === 'all_action') {
			console.log(this.state.all_action);
			this.setState({
				all_action: !this.state.all_action
			});
			if(event.target.checked) {

			}
		}

		console.log(this.state);
		
	}

	changeSelect(selected, xxx) {
		console.log(selected);
		console.log(xxx);
		this.setState({selected_action: selected});
	}

	changeSelect_(sel) {
		this.setState({selected_action_: sel});
	}

	generate() {
		console.log(this.validator.allValid());
		if (!this.validator.allValid()) {
			this.validator.showMessages();
			// rerender to show messages for the first time
			// you can use the autoForceUpdate option to do this automatically`
			this.forceUpdate();
			console.log('form error');
			return false;
		}

		//alert();

		let temp={};
		temp['Name'] = this.state.name;
		temp['Version'] = "2012-10-17";
		temp['Statement'] = []
		let statement = {}
		statement['Effect'] = this.state.Effect

		if(this.state.all_action) {
			let temp = [];
			let tmp = 's3:*';
			temp.push(tmp);
			statement['Action'] = temp;
		} else {
			console.log(this.state.selected_action);
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

		//console.log(this.state);
		statement['Resource'] = this.state.Resource
		if(typeof this.state.Resource === 'string') {
			if(this.state.Resource.match(/,/)) {
				statement['Resource'] = this.state.Resource.split(',');
			} else {
				statement['Resource'] = this.state.Resource;
			}
		}

		if(this.state?.Sid !== '') {
			console.log(this.state.Sid);
			statement['Sid'] = this.state.Sid;
		}

		if(this.state?.Condition !== '') {
			console.log(this.state.Condition);
			statement['Condition'] = this.state.Condition;
		}

		console.log(this.state)


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
		//console.log(this.state);
		return (
			<>
			<div className="row">
				<div className="col-md-6 offset-md-3">
					<h2 className="text-center">User Policy</h2>
					<form style={{marginTop:"20px"}} onSubmit={this.handleSubmit}>
						<div className="form-group">
							<label htmlFor="name">Name</label>
							<input type="text" readOnly={this.state.readonly} disabled={this.state.readonly} className="form-control" id="name" value={this.state.name} placeholder="" onChange={this.handleChange} />
							{this.validator.message('name', this.state.name, 'required|alpha_num', {
								messages: {
									required : "Name required.",
									alpha: "Name must be alpha numeric"
								}
							})}
						</div>

						<div className="form-group" style={{"background":"rgb(244, 244, 244)", "padding":"20px 20px", "border-radius": "10px"}}>
							<input type="hidden" id="Sid" value={this.state.Sid} />
							<input type="hidden" id="Condition" value={this.state.Condition} />
							<div className="form-group row">
								<label className="col-sm-4 col-form-labela font-weight-bold">Access level</label>
								<div class="col-sm-8">
									<div class="form-check form-check-inline">
										<input class="form-check-input" type="radio" name="Effect" id="inlineRadio1" value="Allow" checked={this.state.Effect === "Allow"} onChange={this.onValueChange} />
										<label class="form-check-label" for="inlineRadio1">Allow</label>
									</div>
									<div class="form-check form-check-inline">
										<input class="form-check-input" type="radio" name="Effect" id="inlineRadio2" value="Deny" checked={this.state.Effect === "Deny"} onChange={this.onValueChange} />
										<label class="form-check-label" for="inlineRadio2">Deny</label>
									</div>
									{this.validator.message('Effect', this.state.Effect, 'required', {
										messages: {
											required : "Access level required.",
										}
									})}
								</div>
								
							</div>

		

							<div className="form-group row">
								<label className="col-sm-12 font-weight-bold" htmlFor="">Actions</label>
								<div class="col-sm-9">
									
									<Select
										key={++inputKey}
										closeMenuOnSelect = {false}
										components = {animatedComponents}
										// defaultValue = {this.state.selected_action.map((v) => {
										// 	if(typeof v !== 'string') return v
										// 	else return { value: v, label: v.replace(/s3:/, '')}
										// })}
										defaultValue = {this.state.selected_action}
										isMulti
										options = {this.actions.map((v) => ({ value: v, label: v.replace(/s3:/, '')}))}
										onChange = {this.changeSelect.bind(this)}
										isDisabled = {this.state.all_action}
										// onChange={option => {
										// 	valueType === "string"
										// 	  ? onChange(isMulti ? option.map(o => o.value) : option.value)
										// 	  : onChange(option)
										// 	}
										//   }
										
										//value={this.actions.filter(({value}) => value === this.state.selected_action)}
										//value={this.actions.filter(({ id }) => id === this.state.id)}
										//getOptionLabel={({ label }) => label}
										//getOptionValue={({ value }) => value}
										//onChange={({ value }) => this.setState({ id: value })}
										//defaultValue={this.actions.filter(({value}) => value.value === this.selectedValue)}
									/>
									{/* <Select
										closeMenuOnSelect = {false}
										components = {animatedComponents}
										defaultValue = {this.state.selected_action}
										isMulti
										options = {this.actions}
										onChange = {this.changeSelect.bind(this)}
										// onChange={option => {
										// 	valueType === "string"
										// 	  ? onChange(isMulti ? option.map(o => o.value) : option.value)
										// 	  : onChange(option)
										// 	}
										//   }
										isDisabled = {this.state.all_action}
										//value={this.actions.filter(({value}) => value === this.state.selected_action)}
										//value={this.actions.filter(({ id }) => id === this.state.id)}
										//sgetOptionLabel={({ value }) => value}
										//getOptionValue={({ value }) => value}
										//onChange={({ value }) => this.setState({ id: value })}
										//defaultValue={this.actions.filter(({value}) => value.value === this.selectedValue)}
									/> */}
									
									{ this.conditional_validation() }
								</div>
								<div class="col-sm-3 col-form-label">
									<input key={++inputKey} class="form-check-input" type="checkbox" name="all_action" id="all_action_" defaultChecked={this.state.all_action} onChange={this.onValueChange}  />
									{/* <input key={++inputKey} class="form-check-input" type="checkbox" name="all_action_" checked={this.state.all_action} onChange={this.onValueChange}  /> */}
									<label class="form-check-label" for="all_action_">All Actions</label>
								</div>
								
							</div>
							
							<div className="form-group">
								<label htmlFor="Resource" className="font-weight-bold">Resource</label>
								<input type="text" className="form-control" name="Resource" id="Resource" value={this.state.Resource} onChange={this.handleChange} />
								{this.validator.message('Resource', this.state.Resource, ['required', {regex: "^arn:(?:aws|minio):s3:::[a-z0-9\.\-\/\*]+(,\s?arn:(?:aws|minio):s3:::[a-z0-9\.\-\/\*]+){0,}$"}], {
									messages: {
										required : "Resource required.",
										regex : "Resource must be in below pattern.",
									}
								})}
								
							
								<small class="form-text text-muted">We should mention bucket or path (should be start with "arn:aws:s3:::" and multiple Resource must be seperated by ",")</small>
							</div>
						</div>
						
						{/* <div className="form-group">
							<label htmlFor="gender">Buckets</label>
							<select className="form-control" id="bucket" value={this.state.bucket} onChange={this.handleChange}>
								<option value="">Select</option>
							</select>
						</div> */}
						<div className="form-group text-right">
							<button type="submit" className="btn btn-sm btn-primary">add</button>
							<button type="button" className="btn btn-sm btn-primary ml-2" onClick="">remove</button>

						</div>
						<div className="form-group d-none">
							<div className="form-group">
								<button type="button" className="btn btn-sm btn-primary" onClick={this.generate.bind(this)}>Generate</button>
							</div>
							<div className="form-group">
								<textarea className="form-control" value={JSON.stringify(this.state.policy, null, 2)}></textarea>
							</div>
						</div>
						<div className="form-group">
							<button type="submit" className="btn btn-primary">Save</button>
							<button type="button" className="btn btn-danger ml-2" onClick={this.props.history.goBack}>Cancel</button>
						</div>
					</form>

					
				</div>
			</div>
			
			
			</>
		);
	}
}

//export default Policy;
export default withAlert()(Policy);