import React, { useState } from 'react';
import {useForm} from 'react-hook-form';
//import { Redirect } from 'react-router-dom';

import { useHistory } from "react-router-dom";

import { authenticationService } from '../services/authenticationService';
import http from '../services/Request';
import { useAlert } from 'react-alert'


function Login(params) {
	let history = useHistory();
	if (authenticationService.is_valid()) {
		history.push('/');
	}

	const alert = useAlert()

	const [mfa, setMfa] = useState(false);

	const {register, handleSubmit, errors} = useForm();

	const onSubmit = (data) => {

		http.post('/auth', data)
        .then(function (response) {
            console.log(response);
            if(response.data['status']!=undefined) {
                if(response.data['status']=='success') {
                    let user_data = response.data.data;
                    // console.log(user_data);
                    // localStorage.setItem('currentUser', JSON.stringify(user_data));
                    // currentUserSubject.next(user_data);
                    // localStorageService.setToken(user_data)
					authenticationService.login(user_data);
                } else {

					if(response.status==206) {
						setMfa(true);
					}
					
                    alert.error(response.data['message']);
                }
            }
            
        })
        .catch(function (error) {
            //alert(error);
            console.log(error);
            let data = error.response.data;
            alert.error(data.message);
        })
        .then(function () {
            // always executed
        });

		//authenticationService.login(data);
		
	}

	return(
		<div className="row">
			<div className="col-md-4 offset-md-4">
				<h2 className="text-center">Login</h2>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="form-group">
						<label htmlFor="email">Email address</label>
						<input type="email" ref={register({required: true, pattern : /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/})} className="form-control" name="email" id="email" />
						{errors.email && errors.email.type==='required' && (
							<p className="text-danger">Email is required.</p>
						)}
						{errors.email && errors.email.type==='pattern' && (
							<p>This field must be email.</p>
						)}
						<small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input type="password" ref={register({
							required : 'Password required.',
							minLength: {
								value : 8,
								message: "Password must be minimum 8 chars."
							}
						})} className="form-control" name="password" id="password" />
						{errors.password?.message && (
							<p className="text-danger">{errors.password.message}</p>
						)}
					</div>
					{mfa && 
						<div className="form-group" >
							<label htmlFor="code">MFA Code</label>
							<input type="password" className="form-control" name="code" id="code" ref={register} />
						</div>
					}
					

					<button type="submit" className="btn btn-primary">Login</button>
				</form>
			</div>
		</div>
	);
}


export default Login;