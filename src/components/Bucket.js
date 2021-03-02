import React from 'react';
import {FaTrash} from 'react-icons/fa';

import API from '../services/Request';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { withAlert } from 'react-alert';


class Bucket extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			buckets: []
		};
		//this.confirm_delete = this.confirm_delete.bind(this);
	}

	componentDidMount() {
		// API.get(`/s3/buckets`)
		// .then(res => {
		// const buckets = res.data.data.Buckets;
		// console.log(buckets);
		// this.setState({ buckets: buckets });
		// console.log(this.state);
		// });
		this.get_buckets();
		
	}

	get_buckets() {
		API.get(`/s3/buckets`)
		.then(res => {
		const buckets = res.data.data.Buckets;
		console.log(buckets);
		this.setState({ buckets: buckets });
		console.log(this.state);
		});
	}

	delete_row(bucket) {
		
		
		confirmAlert({
			title: 'Confirm to delete',
			message: 'Are you sure to do this.',
			buttons: [
			  {
				label: 'Yes',
				onClick: () => {
					this.delete(bucket);
				}
			  },
			  {
				label: 'No',
				//onClick: () => alert('Click No')
			  }
			]
		});		

	}
	
	delete(bucket) {
		API.delete(`/s3/bucket`,{
			params: {name: bucket}
		})
		.then(res => {
			const data = res.data;
			const alert = this.props.alert;
			if(data.status!=undefined) {
				switch (data.status) {
					case 'success':
						alert.show(data.message);
						this.get_buckets();
						break;
				
					default:
						alert.error(data.message);
						break;
				}
			}
		});

	}


	render () {
		return (
			<>
			<div className="row">
				<div className="col-md-6">
					<h2>Buckets</h2>
				</div>
				<div className="col-md-6 text-right">
					<button className="btn btn-primary">Add bucket</button>
				</div>
			</div>
			
			<table className="table table-dark">
				<thead>
					<tr>
					<th scope="col">#</th>
					<th scope="col">Name</th>
					<th scope="col">Action</th>
					</tr>
				</thead>
				<tbody>
					{ this.state.buckets.map((bucket,i) => (
						<tr key={i}>
							<th scope="row">{i+1}</th>
							<td>{bucket.Name}</td>
							<td><FaTrash data={bucket.Name} onClick={this.delete_row.bind(this, bucket.Name)} /></td>
						</tr>
					))
					}
				</tbody>
			</table>
			</>
		);
	}
}

//export default Bucket;
export default withAlert()(Bucket);