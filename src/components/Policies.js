import React from 'react';
import http from '../services/Request';
import { withAlert } from 'react-alert';
import {FaTrash, FaEdit} from 'react-icons/fa';
import {
	Link
  } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PageLoader from './PageLoader';

class Policies extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			policies: [],
			policies_filter: [],
			filter: '',
			loader: false
		};

	}

	componentDidMount() {
		this.get_policies();
	}

	get_policies() {
		this.setState({loader: true});
		http.get(`/s3/policies`)
		.then(res => {
			const policies = res.data.data;
			console.log(policies);
			this.setState({ policies: policies });
			console.log(this.state);
		}).catch(error => {
			console.log(error)
		}).then(()=>{
			this.setState({loader: false});
		});
	}


	delete_row(policy) {
		confirmAlert({
			title: 'Attention!',
			message: 'Are you sure want to delete.',
			buttons: [
			  {
				label: 'Yes',
				onClick: () => {
					this.delete(policy);
				}
			  },
			  {
				label: 'No',
				//onClick: () => alert('Click No')
			  }
			]
		});	
	}

	delete(policy) {
		http.delete(`/s3/policy`,{
			params: {name: policy}
		})
		.then(res => {
			const data = res.data;
			const alert = this.props.alert;
			if(data.status!=undefined) {
				switch (data.status) {
					case 'success':
						alert.success(data.message);
						this.get_policies();
						break;
				
					default:
						alert.error(data.message);
						break;
				}
			}
		}).catch((err) => {
			console.log(err)
		});

	}

	changeFilter(event) {
		//console.log(event.target);
		this.setState({[event.target.name]: event.target.value});

		const regex = new RegExp(''+event.target.value+'', 'gi');
		const matched_policy = this.state.policies.filter((policy) => policy.match(regex));
		//console.log(matched_policy);
		this.setState({policies_filter: matched_policy})
	}

	
	render () {

		let data = (this.state.policies_filter.length || this.state.filter!='') ? this.state.policies_filter : this.state.policies

		let object_length = (data.length) ? data.length : 0;

		return (
			<>
			{this.state.loader && <PageLoader />}
			<div className="row">
				<div className="col-md-6">
					<h2>Policies</h2>
				</div>
				<div className="col-md-6 row text-right">
					<div className="col-md-8 form-group">
						<input type="text" placeholder="Search Policy" className="form-control" name="filter" value={this.state.filter} onChange={this.changeFilter.bind(this)} />
					</div>
					<div className="col-md-4">
					<Link className="btn btn-primary" to="/policy">Add Policy</Link>
					</div>
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
					{ data.map((policy,i) => (
						<tr key={i}>
							<th scope="row">{i+1}</th>
							<td>{policy}</td>
							<td>
								<Link style={{}} to={`/policy/${policy}`}>
									<FaEdit style={{"marginRight":"20px", "color":"#FFF"}} />
								</Link>
								&nbsp;
								<FaTrash onClick={this.delete_row.bind(this, policy)} />
							</td>
						</tr>
					))
					}
					{!object_length &&
						<tr>
							<td colSpan="3" className="text-center">No Policy found.</td>
						</tr>
					}
				</tbody>
			</table>
			</>
		);
	}
}

//export default Policy;
export default withAlert()(Policies);