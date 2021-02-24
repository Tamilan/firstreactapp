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

function Menu(params) {
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