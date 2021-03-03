import React from 'react';
import {FaTrash} from 'react-icons/fa';

import API from '../services/Request';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { withAlert } from 'react-alert';

import { Link } from "react-router-dom";


class Objects extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			objects: [],
			bucket: this.props.match.params.bucket
		};
	}

	componentDidMount() {
		//console.log(this.props);
		//let bucket = this.props.match.params.bucket;
		//this.setState({bucket: bucket});
		// this.setState({bucket : bucket}, ()=>{
		// 	//return this.state.bucket
		// 	console.log(this.state.bucket)
		// });
		this.get_objects();
	}

	get_objects() {
		// console.log(this.state);
		// return;
		API.get(`/s3/${this.state.bucket}/objects`)
		.then(res => {
			const objects = res.data.data.Contents;
			console.log(objects);
			this.setState({ objects: objects });
			console.log(this.state);
		}).catch(error => {
			console.log(error)
		});
	}

	delete_row(object) {
		
		
		confirmAlert({
			title: 'Confirm to delete',
			message: 'Are you sure to do this.',
			buttons: [
			  {
				label: 'Yes',
				onClick: () => {
					this.delete(object);
				}
			  },
			  {
				label: 'No',
				//onClick: () => alert('Click No')
			  }
			]
		});		

	}
	
	delete(object) {
		API.delete(`/s3/object`,{
			params: {
				'bucket': this.state.bucket,
				'object': object.Key
			}
		})
		.then(res => {
			const data = res.data;
			const alert = this.props.alert;
			if(data.status!=undefined) {
				switch (data.status) {
					case 'success':
						alert.success(data.message);
						this.get_objects();
						break;
				
					default:
						alert.error(data.message);
						break;
				}
			}
		});

	}

	formatBytes(bytes, decimals = 2) {
		if (bytes === 0) return '0 Bytes';
	
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	
		const i = Math.floor(Math.log(bytes) / Math.log(k));
	
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}


	render () {
		let objectLength = 0;
		if(this.state.objects.length>0) {
			objectLength = this.state.objects.length;
		}

		return (
			<>
			<div className="row">
				<div className="col-md-6">
					<h2>Objects</h2>
				</div>
				<div className="col-md-6 text-right">
					<Link to="/object/add">
					<button className="btn btn-primary">
						Add Object
					</button>
					</Link>
				</div>
			</div>
			
			<table className="table table-dark">
				<thead>
					<tr>
					<th scope="col">#</th>
					<th scope="col">Name</th>
					<th scope="col">Storage class</th>
					<th scope="col">Last modified</th>
					<th scope="col">Size</th>
					<th scope="col">Action</th>
					</tr>
				</thead>
				<tbody>
					{ this.state.objects.map((object,i) => (
						<tr key={i}>
							<th scope="row">{i+1}</th>
							<td>{object.Key}</td>
							<td>{object.StorageClass}</td>
							<td>{(new Date(object.LastModified)).toDateString()}</td>
							<td>{this.formatBytes(object.Size)}</td>
							<td><FaTrash onClick={this.delete_row.bind(this, object)} /></td>
						</tr>
					))
					}
					{!objectLength &&
						<tr>
							<td colSpan="6" className="text-center">No objects found.</td>
						</tr>
					}
				</tbody>
			</table>
			</>
		);
	}
}

export default withAlert()(Objects);
