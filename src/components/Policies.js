import React from 'react';
import http from '../services/Request';
import { withAlert } from 'react-alert';
import {FaTrash, FaEdit} from 'react-icons/fa';
import {
	Link
  } from "react-router-dom";

class Policies extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			policies: [],
			policies_filter: [],
			filter: ''
		};

	
		// this.validator = new SimpleReactValidator({className : "text-danger"});
		// this.handleChange = this.handleChange.bind(this);
		// this.onValueChange = this.onValueChange.bind(this);

	}

	componentDidMount() {
		this.get_policies();
	}

	get_policies() {
		http.get(`/s3/policies`)
		.then(res => {
			const policies = res.data.data;
			console.log(policies);
			this.setState({ policies: policies });
			console.log(this.state);
		}).catch(error => {
			console.log(error)
		});
	}


	delete_row(policy) {

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
								<Link to={`/policy/${policy}`}>
									<FaEdit style={{"marginRight":"20px"}} />
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