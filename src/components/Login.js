import React from 'react';
import {useForm} from 'react-hook-form';

let renderCnt = 0;

function Login(params) {
	const {register, handleSubmit, errors} = useForm();
	renderCnt++;

	const onSubmit = (data) => {
		alert(JSON.stringify(data));
	}

	//console.log(errors);

	return(
		<div class="row">
			<div class="col-md-4 offset-md-4">
				<h2 class="text-center">Login</h2>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div class="form-group">
						<label for="email">Email address</label>
						<input type="email" ref={register({required: true, pattern : /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/})} class="form-control" name="email" id="email" />
						{errors.email && errors.email.type==='required' && (
							<p class="text-danger">Email is required.</p>
						)}
						{errors.email && errors.email.type==='pattern' && (
							<p>This field must be email.</p>
						)}
						<small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
					</div>
					<div class="form-group">
						<label for="password">Password</label>
						<input type="password" ref={register({
							required : 'Password required.',
							minLength: {
								value : 8,
								message: "Password must be minimum 8 chars."
							}
						})} class="form-control" name="password" id="password" />
						{errors.password?.message && (
							<p class="text-danger">{errors.password.message}</p>
						)}
					</div>
					{/* <div class="form-group form-check">
						<input type="checkbox" class="form-check-input" id="exampleCheck1" />
						<label class="form-check-label" for="exampleCheck1">Check me out</label>
					</div> */}
					<button type="submit" class="btn btn-primary">Submit {renderCnt}</button>
				</form>
			</div>
		</div>
	);
}

function Login_test(params) {
	const {register, handleSubmit, errors, watch, setValue} = useForm({
		defaultValues: {
			email: "",
			password: ""
		}
	});
	const { email, password } = watch();

	React.useEffect(() => {
		register({ name: "email" });
		register({ name: "password" });
	}, [register]);

	const handleChange = (name, e) => {
		e.persist();
		setValue(name, e.target.value);
	};
	
	renderCnt++;

	const onSubmit = (data) => {
		alert(JSON.stringify(data));
	}

	//console.log(errors);

	return(
		<div class="row">
			<div class="col-md-6 offset-md-3">
				<h2 class="text-center">Login</h2>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div class="form-group">
						<label for="email">Email address</label>
						<input onChange={handleChange.bind(null, "email")} value={email} />
						{/* <input type="email" ref={register({required: true, pattern : /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/})} class="form-control" name="email" id="email" />
						{errors.email && errors.email.type==='required' && (
							<p class="text-danger">This field is required.</p>
						)}
						{errors.email && errors.email.type==='pattern' && (
							<p>This field must be email.</p>
						)} */}
						<small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
					</div>
					<div class="form-group">
						<label for="password">Password</label>
						<input type="password" ref={register({
							required : 'Password required.',
							minLength: {
								value : 8,
								message: "Password must be minimum 8 chars."
							}
						})} class="form-control" name="password" id="password" />
						{errors.password?.message && (
							<p class="text-danger">{errors.password.message}</p>
						)}
					</div>
					{/* <div class="form-group form-check">
						<input type="checkbox" class="form-check-input" id="exampleCheck1" />
						<label class="form-check-label" for="exampleCheck1">Check me out</label>
					</div> */}
					<button type="submit" class="btn btn-primary">Submit {renderCnt}</button>
				</form>
			</div>
		</div>
	);
}

class Login1 extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
		<div class="row">
			<div class="col-md-6 offset-md-3">
				<h2 class="text-center">Login</h2>

				<form>
					<div class="form-group">
						<label for="exampleInputEmail1">Email address</label>
						<input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
						<small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
					</div>
					<div class="form-group">
						<label for="exampleInputPassword1">Password</label>
						<input type="password" class="form-control" id="exampleInputPassword1" />
					</div>
					{/* <div class="form-group form-check">
						<input type="checkbox" class="form-check-input" id="exampleCheck1" />
						<label class="form-check-label" for="exampleCheck1">Check me out</label>
					</div> */}
					<button type="submit" class="btn btn-primary">Submit</button>
				</form>
			</div>
		</div>
	  );
	}
}

export default Login;