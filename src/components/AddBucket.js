import {useForm} from 'react-hook-form';
import API from '../services/Request';
import { useAlert } from 'react-alert';
import { useHistory } from "react-router-dom";

//import Alert from './Alert';

//import React from 'react';

// class AddBucket extends React.Component {

// 	render() {
// 		return(
// 			<h2>add bucket</h2>
// 		);
// 	}
// }

function AddBucket() {
	let history = useHistory();
	const {register, handleSubmit, errors} = useForm();
	const alert = useAlert();
	const onSubmit = (data) => {
		//alert(JSON.stringify(data));
		// console.log(Alert);
		// alertt();
		// Alert.alertt();
		//Alert.props.alertt();
		// return;
		API.post(`/s3/bucket`,{
			params: data
		})
		.then(res => {
			

			const data = res.data;
			if(data.status!=undefined) {
				switch (data.status) {
					case 'success':
						alert.success(data.message);
						history.push('/buckets');
						break;
				
					default:
						alert.error(data.message);
						break;
				}
			}
			// alert.show('sample');
			// console.log(response);
		});
	
	}

	return(
		<div className="row">
			<div className="col-md-4 offset-md-4">
				<h2 className="text-center">Add bucket</h2>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="form-group">
						<label htmlFor="bucket">Name</label>
						<input type="text" ref={register({
							required : 'Name required.',
							pattern: {
								value : /^[a-z0-9]+$/,
								message: "Invalid characters accept only lowercase alphanumeric."
							}
						})} className="form-control" name="bucket" />
						{errors.bucket?.message && (
							<p className="text-danger">{errors.bucket.message}</p>
						)}
					</div>

					<button type="submit" className="btn btn-primary">Save</button>
				</form>
			</div>
		</div>
	);
}

export default AddBucket;