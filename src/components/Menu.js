import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
  } from "react-router-dom";
import Home from './Home';
import Users from './Users';
import Login from './Login';
import Signup from './Signup';
import AdminPage from './AdminPage';
import Buckets from './Buckets';
import AddBucket from './AddBucket';
import Objects from './Objects';
import Profile from './Profile';
import User from './User';
import Policy from './Policy';
import Policies from './Policies';


import { history } from '../helpers/history';
import { Role } from '../helpers/role';
import { authenticationService } from '../services/authenticationService';
import { PrivateRoute } from './PrivateRoute';

//import Breadcrumb from './Breadcrumb';

class Menu extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
            currentUser: null,
            is_admin: false
        };
	}

	componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            //is_admin: x && x.role === Role.Admin
        }));
    }

    logout() {
        authenticationService.logout();
        history.push('/login');
    }

	render() {
		const { currentUser, is_admin } = this.state;

		//const [crumbs, setCrumbs] = useState(['Home', 'Category', 'Sub Category']);

		// const selected = crumb => {
		// 	console.log(crumb);
		// }

		return (
		<Router history={history}>
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
				<a className="navbar-brand" href="#">Fonicom</a>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav mr-auto">

					{currentUser &&
						<>
                        <li className="nav-item active">
							{/* <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a> */}
							<Link className="nav-link" to="/">Home</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/buckets">Buckets</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/users">Users</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/policies">Policies</Link>
						</li>
						{is_admin &&
						<li className="nav-item">
							<Link className="nav-link" to="/admin">Admin</Link>
						</li>
						}
						
						</>
                    }

					{!currentUser &&
						<>
						<li className="nav-item">
							<Link className="nav-link" to="/signup">Signup</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/login">Login</Link>
						</li>
						</>
					}

												
					
					{/* <li className="nav-item">
						<a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
					</li> */}
					</ul>
					{currentUser &&
						<>
						<span class="navbar-text">
							<Link className="nav-link" to="/profile">{ authenticationService.get_name() }</Link>
							{/* { authenticationService.get_name() } */}
						</span>
						<span class="navbar-text">
							<a href="#" className="nav-link" onClick={this.logout} >Logout</a>
						</span>
						</>
					}
				</div>
			</nav>
			{/* <Breadcrumb crumbs={ crumbs } selected={ selected }  /> */}
			<div className="container" style={{"marginTop" : "50px"}}>
				<Switch>

					{/* <Route path="/signup">
						<Signup />
					</Route>
					<Route path="/login">
						<Login />
					</Route>
					<Route path="/users">
						<Users />
					</Route>
					<Route exact path="/">
						<Home />
					</Route> */}

					<Route path="/signup" component={Signup} />
					<Route path="/login" component={Login} />
					<PrivateRoute path="/users" roles={[Role.User, Role.Admin]} component={Users} />

					<PrivateRoute path="/buckets" component={Buckets} />

					<PrivateRoute path="/bucket/add" component={AddBucket} />

					<PrivateRoute exact path="/:bucket/objects" component={Objects} />


					<PrivateRoute exact path="/" component={Home} />
					<PrivateRoute path="/admin" roles={[Role.Admin]} component={AdminPage} />
					<PrivateRoute exact path="/profile" component={Profile} />
					<PrivateRoute path="/user/:id" component={User} />
					<PrivateRoute exact path="/policy" component={Policy} />
					<PrivateRoute exact path="/policies" component={Policies} />
					<PrivateRoute path="/policy/:policy_name" component={Policy} />
					

				</Switch>
			</div>
		</Router>
		);
	}
}

function Menu1(params) {
	return <Router>
			<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
				<a class="navbar-brand" href="#">Fonicom</a>
				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>

				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav mr-auto">
					<li class="nav-item active">
						{/* <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a> */}
						<Link class="nav-link" to="/">Home</Link>
					</li>
					<li class="nav-item">
						<Link class="nav-link" to="/users">Users</Link>
					</li>
					<li class="nav-item">
						<Link class="nav-link" to="/signup">Signup</Link>
					</li>
					<li class="nav-item">
						<Link class="nav-link" to="/login">Login</Link>
					</li>
					{/* <li class="nav-item">
						<a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
					</li> */}
					</ul>
				</div>
			</nav>
			
			<div class="container" style={{"marginTop" : "50px"}}>
				<Switch>
					<Route path="/signup">
						<Signup />
					</Route>
					<Route path="/login">
						<Login />
					</Route>
					<Route path="/users">
						<Users />
					</Route>
					<Route exact path="/">
						<Home />
					</Route>
				</Switch>
			</div>
		</Router>;
}

export default Menu;