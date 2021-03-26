import React, {Fragment} from 'react';

import http from '../services/Request';

import { withAlert } from 'react-alert';

import SimpleReactValidator from 'simple-react-validator';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

let inputKey = 0;

class Policy_ extends React.Component {
	constructor(props) {
		super(props);
		let update = (this.props.match.params?.policy_name !== undefined) ? true : false
		//console.log(update)
		//let update = ()
		this.state = {
			p_name: this.props.match.params.policy_name,
			update: update,
			name: '',
			Version: '',
			// Effect: '',
			// Resource: '',
			// //all_action: false,
			// selected_action: [],
			// selected_action_: [{ value: 's3:DeleteBucket', label: 'DeleteBucket' }],
			readonly: false,
			fields: [{
				Effect: 'Allow',
				//Action: '',
				selected_action: [],
				all_action: true,
				Resource:''
			}],
			policy_data:{}
		};

		//this.policy = {}
		//this.policy_data = []
		
		this.validator = new SimpleReactValidator({className : "text-danger", autoForceUpdate: this});
		this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
		//this.onValueChange = this.onValueChange.bind(this);

		this.handleInputChange = this.handleInputChange.bind(this);

		this.actions = ['s3:AbortMultipartUpload', 's3:CreateBucket', 's3:DeleteBucket', 's3:ForceDeleteBucket', 's3:DeleteBucketPolicy', 's3:DeleteObject', 's3:GetObject', 's3:ListAllMyBuckets', 's3:ListBucket'];

	}

	componentDidMount() {
		//this.get_user();
		//const { match: { params } } = this.props;
		console.log(this.props);
		if(this.state.update) {
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
		
		this.setState({name: this.state.p_name, readonly:true, Version: data.Version});

		console.log(data);
		const fields = []
		if(data['Statement'] != undefined) {
			if(data['Statement'].length > 0) {

				for (let i = 0; i < data['Statement'].length; i++) {
					const statement = data['Statement'][i];
					console.log(statement);

					let p_data = {}
					if(statement['Sid']!=undefined) {
						p_data['Sid'] = statement['Sid']
					}

					if(statement['Effect']!=undefined) {
						p_data['Effect'] = statement['Effect']
					}

					if(statement['Resource']!=undefined) {
						p_data['Resource'] = statement['Resource']
					}

					if(statement['Condition']!=undefined) {
						p_data['Condition'] = statement['Condition']
					}
					p_data['selected_action'] = []
					if(statement['Action']!=undefined) {
						let action = statement['Action'];
						if(typeof action === 'object') {

							if(action.length > 0) {
								let skip = false
								for(var j=0; j<action.length; j++) {
									if(action[j] === 's3:*') {
										p_data['all_action'] = true
										//this.setState({all_action: true})
										skip = true
										break;
									}
								}
								if(!skip) {
									let reformed_action = action.map((v) => ({ value: v, label: v.replace(/s3:/, '')}))
									p_data['selected_action'] = reformed_action
									//this.setState({selected_action: reformed_action})
								}
							} 
						}
					}
					fields.push(p_data);
				}
			}
		}
		//console.log(fields);
		this.setState({fields:fields})
		//console.log(this.state);

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
				policy: this.state.policy_data,
			};

			if(this.state.update) {
				data['update'] = true
			}
			http.post(`/s3/policy`,
			data
			).then(response => {
				let data = response.data;
				_alert.success(data.message);
				//this.reset_form();
				//this.validator.hideMessages();
				console.log(data);
				this.props.history.goBack()
				
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
		//console.log(this.state);
	}

	validate_form() {
		if (!this.validator.allValid()) {
			this.validator.showMessages();
			// rerender to show messages for the first time
			// you can use the autoForceUpdate option to do this automatically`
			this.forceUpdate();
			console.log('form error');
			return false
		}
		return true
	}

	generate() {
		//console.log(this.validator.allValid());
		// if (!this.validator.allValid()) {
		// 	this.validator.showMessages();
		// 	this.forceUpdate();
		// 	console.log('form error');
		// 	return false;
		// }

		if(!this.validate_form()) {
			console.log('eeerrr')
			return false;
		}



		let policy_data={};
		policy_data['Name'] = this.state.name;
		policy_data['Version'] = (this.state?.Version !='') ? this.state.Version : "2012-10-17"
		policy_data['Statement'] = []

		//const fields = this.state.fields
		if (this.state.fields.length == 0) {
			alert('Policy should have atleast 1 statement');
			return
		}

		for (let i = 0; i < this.state.fields.length; i++) {
			let fields = this.state.fields[i]
			
			let statement = {}
			statement['Effect'] = fields.Effect

			if(fields.all_action) {
				statement['Action'] = ['s3:*']
			} else {
				console.log(fields.selected_action);
				if(fields.selected_action.length > 0) {
					var sel_val = [];
					fields.selected_action.forEach((val, key) => {
						sel_val.push(val.value);
					})
					statement['Action'] = sel_val
					console.log(sel_val);
					// let action = this.state.selected_action.join(',');
					//console.log(this.state.selected_action)
					//console.log(action)
				}
			}

			statement['Resource'] = fields.Resource
			if(typeof fields.Resource === 'string') {
				statement['Resource'] = []
				if(fields.Resource.match(/,/)) {
					statement['Resource'] = fields.Resource.split(',');
				} else {
					statement['Resource'].push(fields.Resource)
					//statement['Resource'] = fields.Resource;
				}
			}

			if(fields?.Sid !== undefined) {
				//console.log(this.state.Sid);
				statement['Sid'] = fields.Sid;
			}

			if(fields?.Condition !== undefined) {
				//console.log(fields.Condition);
				statement['Condition'] = fields.Condition;
			}

			//console.log(this.state)


			policy_data['Statement'].push(statement);

		}
		
		this.setState({policy_data: policy_data});

		console.log(this.state);
		return true;
	}

	conditional_validation(index) {

		if(!this.state.fields[index].all_action) {

			if(this.state.fields[index].selected_action.length == 0) {
				return this.validator.message('actionss', this.state.fields[index].selected_action, 'required', {
					messages: {
						required : "Action required.",
					}
				})
			}
		}

	}

	changeSelect(selected, action) {
		// console.log(selected);
		// console.log(action);
		// console.log(action.name);
		let name_arr = action.name.split('_');
		// console.log(name_arr);
		let f = 'selected_action'
		let v = selected
		let index = parseInt(name_arr[1]);
		this.setState({
			fields : this.state.fields.map((arr, i) => {
				if(i !== index) return arr;
				// console.log(i);
				// console.log(arr)
				arr[f] = v
				return arr;
				//return {...arr, [f]: v}
			})
		})

		// console.log(this.state)
	}

	handleInputChange(index, event) {
		// console.log(index);
		// console.log(event.target.name);
		// console.log(event.target.value);

		let f = event.target.name
		let v = event.target.value

		if(event.target.type === 'radio' || event.target.type === 'checkbox') {
			//event.target['for-name']
			f = event.target.getAttribute('for-name')
		}
		// console.log(f)
		// console.log(event.target)
		
		this.setState({
			fields : this.state.fields.map((arr, i) => {
				if(i !== index) return arr;
				// console.log(i);
				// console.log(arr)
				
				if(f=='all_action') arr[f] = !arr[f]
				else arr[f] = v

				return arr;
				//return {...arr, [f]: v}
			})
		})

		// console.log(this.state);


		// let a = {
		// 		...this.state,
		// 		fields : this.state.fields.map((arr, i) => {
		// 			if(i!==index) return arr;
		// 			console.log(i);
		// 			console.log(arr)
		// 			// arr[f] = v
		// 			// return arr;
		// 			return {...arr, [f]: v}
		// 		})
		// 	}
		// console.log(a);
	}

	handleRemoveFields(index) {
		const values = this.state.fields;
		if(values.length==1) {
			return false
		}
		values.splice(index, 1);
		this.setState({
			fields : values
		})
	}

	handleAddFields() {

		if(!this.validate_form()) {
			console.log('eeerrr')
			return false;
		}

		const values = this.state.fields;
		values.push({
			Effect: 'Allow',
			//Action: '',
			selected_action: [],
			all_action: false,
			Resource:''
		});
		this.setState({
			fields : values
		})
	}

	
	render () {
		this.validator.purgeFields();
		console.log(this.state);
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
						
						{this.state.fields.map((fields, index) => (
							<Fragment key={`${fields}~${index}`}>
							<div className="form-group" style={{"background":"rgb(244, 244, 244)", "padding":"20px 20px", "border-radius": "10px"}}>
								<div className="form-group text-center">
									<label className="font-weight-bold">{index+1}. Statement</label>
								</div>

								<div className="form-group row">
									<label className="col-sm-4 col-form-labela font-weight-bold">Access level</label>
									<div class="col-sm-8">
										<div class="form-check form-check-inline">
											<input class="form-check-input" type="radio" for-name="Effect" name={`Effect_`+index} id={`Effect_id_1_`+index} value="Allow" checked={fields.Effect === "Allow"} onChange={event => this.handleInputChange(index, event)} />
											<label class="form-check-label" for={`Effect_id_1_`+index}>Allow</label>
										</div>
										<div class="form-check form-check-inline">
											<input class="form-check-input" type="radio" for-name="Effect" name={`Effect_`+index} id={`Effect_id_2_`+index} value="Deny" checked={fields.Effect === "Deny"} onChange={event => this.handleInputChange(index, event)} />
											<label class="form-check-label" for={`Effect_id_2_`+index}>Deny</label>
										</div>
										{this.validator.message(`Effect_`+index, fields.Effect, 'required', {
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
											defaultValue = {fields.selected_action}
											isMulti
											options = {this.actions.map((v) => ({ value: v, label: v.replace(/s3:/, '')}))}
											//onChange={event => this.handleInputChange(index, event)}
											onChange = {this.changeSelect.bind(this)}
											isDisabled = {fields.all_action}
											name={`action_`+index}
										/>
										
										
										{ this.conditional_validation(index) }
									</div>
									<div class="col-sm-3 col-form-label">
										<input key={++inputKey} class="form-check-input" type="checkbox" name={`all_action_`+index} for-name="all_action" id="all_action_" id={`all_action_`+index} defaultChecked={fields.all_action} 
										// onChange={this.onValueChange} 
										onChange={event => this.handleInputChange(index, event)}
										/>
										<label class="form-check-label" for={`all_action_`+index}>All Actions</label>
									</div>
									
								</div>

								<div className="form-group">
									<label htmlFor="Resource" className="font-weight-bold">Resource</label>
									<input type="text" className="form-control" name="Resource" id="Resource" value={fields.Resource} onChange={event => this.handleInputChange(index, event)} />
									{this.validator.message('Resource', fields.Resource, ['required', {regex: "^arn:(?:aws|minio):s3:::[a-z0-9\.\-\/\*]+(,\s?arn:(?:aws|minio):s3:::[a-z0-9\.\-\/\*]+){0,}$"}], {
										messages: {
											required : "Resource required.",
											regex : "Resource must be in below pattern.",
										}
									})}
									
								
									<small class="form-text text-muted">We should mention bucket or path (should be start with "arn:aws:s3:::" and multiple Resource must be seperated by ",")</small>
								</div>

								<div className="form-group text-right">
									<button title="Remove this statement"
									className="btn btn-danger btn-sm"
									type="button"
									onClick={() => this.handleRemoveFields(index)}
									>
									-
									</button>
									
								</div>
							</div>
							</Fragment>
						))}
						
						
						<div className="form-group text-right">
							<button title="Add more Statement" type="button" onClick={() => this.handleAddFields()} className="btn btn-sm btn-primary">+</button>
							{/* <button type="button" className="btn btn-sm btn-primary ml-2" onClick="">remove</button> */}

						</div>
						<div className="form-group d-none">
							<div className="form-group">
								<button type="button" className="btn btn-sm btn-primary" onClick={this.generate.bind(this)}>Generate</button>
							</div>
							<div className="form-group">
								<textarea className="form-control" value={JSON.stringify(this.state.policy_data, null, 2)}></textarea>
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
export default withAlert()(Policy_);