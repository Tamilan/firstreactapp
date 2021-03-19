import React from 'react';
import {useForm} from 'react-hook-form';
//import { Redirect } from 'react-router-dom';

import { useHistory } from "react-router-dom";

import { authenticationService } from '../services/authenticationService';


function Login_s3(params) {
	let history = useHistory();
	if (authenticationService.is_valid()) {
		history.push('/');
	}

	const {register, handleSubmit, errors} = useForm();

	const onSubmit = (data) => {
		authenticationService.login(data);
	}

	return(
		<div className="row">
			<div className="col-md-4 offset-md-4">
				<h2 className="text-center">Login</h2>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="form-group">
						<label htmlFor="access_key">Access Key</label>
						<input type="text" ref={register({required: true})} className="form-control" name="access_key" />
						{errors.access_key && errors.access_key.type==='required' && (
							<p className="text-danger">Access Key required.</p>
						)}
						{errors.email && errors.email.type==='pattern' && (
							<p>This field must be email.</p>
						)}
					</div>
					<div className="form-group">
						<label htmlFor="password">Secret Key</label>
						<input type="secret_key" ref={register({
							required : 'Secret Key required.',
							minLength: {
								value : 8,
								message: "Secret Key must be minimum 8 chars."
							}
						})} className="form-control" name="secret_key" />
						{errors.secret_key?.message && (
							<p className="text-danger">{errors.secret_key.message}</p>
						)}
					</div>
					<button type="submit" className="btn btn-primary">Login</button>
				</form>
			</div>
		</div>
	);
}


export default Login;