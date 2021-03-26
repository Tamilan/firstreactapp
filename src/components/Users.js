import React from 'react';
import {FaTrash} from 'react-icons/fa';

import http from '../services/Request';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { withAlert } from 'react-alert';

import { Link } from "react-router-dom";

import PageLoader from './PageLoader';


class Users extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			users: [],
			loader: false
		};
	}

	componentDidMount() {
		this.get_users();
	}

	get_users() {
		this.setState({loader: true});
		http.get(`/users`)
		.then(res => {
			let response = res.data;
			console.log(response);
			this.setState({ users: response });
		
			console.log(this.state);
		}).catch( err => {
			console.log(err);
			
		}).then(() => {
			this.setState({loader: false});
		});
	}

	delete_row(user) {
		
		
		confirmAlert({
			title: 'Attention!',
			message: 'Are you sure want to delete.',
			buttons: [
			  {
				label: 'Yes',
				onClick: () => {
					this.delete(user);
				}
			  },
			  {
				label: 'No',
				//onClick: () => alert('Click No')
			  }
			]
		});		

	}
	
	delete(user) {
		http.delete(`/user`,{
			params: {id: user.id}
		})
		.then(res => {
			const data = res.data;
			const alert = this.props.alert;
			if(data.status!=undefined) {
				switch (data.status) {
					case 'success':
						alert.success(data.message);
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
			{this.state.loader && <PageLoader />}
			{/* <Loader variant="secondary" /> */}
			<div className="row">
				<div className="col-md-6">
					<h2>Users</h2>
				</div>
				{/* <div className="col-md-6 text-right">
					<Link to="/bucket/add">
					<button className="btn btn-primary">
						Add bucket
					</button>
					</Link>
				</div> */}
			</div>
			
			<table className="table table-dark">
				<thead>
					<tr>
					<th scope="col">#</th>
					<th scope="col">Name</th>
					<th scope="col">Email</th>
					<th scope="col">Gender</th>
					<th scope="col">Created on</th>
					<th scope="col">Action</th>
					</tr>
				</thead>
				<tbody>
					{ this.state.users.map((user,i) => (
						<tr key={i}>
							<th scope="row">{i+1}</th>
							<td><Link style={{"color":"#FFF"}} to={`/user/${user.id}`}>{user.name}</Link></td>
							<td>{user.email}</td>
							<td>{user.gender}</td>
							<td>{(new Date(user.created_on)).toDateString()}</td>
							<td><FaTrash data={user.id} onClick={this.delete_row.bind(this, user)} /></td>
						</tr>
					))
					}
				</tbody>
			</table>
			</>
		);
	}
}

//export default Users;
export default withAlert()(Users);