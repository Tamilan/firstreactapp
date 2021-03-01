import { BehaviorSubject } from 'rxjs';

//import config from 'config';
import { handleResponse } from '../helpers/handleResponse';
import axios from "axios";

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
	is_valid,
    get_role,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value },
};

function is_valid() {
    let user = currentUserSubject.value;
    console.log(user);
    if(!user) {
        return false;
    }
    if(user.id!==undefined && user.id!=='') {
        return true;
    }
    return false;
}

function get_role() {
    let user = currentUserSubject.value;
    //console.log(user);
    if(!user) {
        return null;
    }
    if(user.role!==undefined && user.role!=='') {
        return user.role;
    }
    return null;
}

function login(user) {

    const instance = axios.create({
        baseURL: 'http://localhost:3001',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
    });


    return instance.post('/auth', {
        params: {
          user
        }
      })
      .then(function (response) {
        console.log(response);
        let user_data = response.data;
        localStorage.setItem('currentUser', JSON.stringify(user_data));
        currentUserSubject.next(user_data);
      })
      .catch(function (error) {
        alert(123);
        console.log(error);
      })
      .then(function () {
        // always executed
      });
	
	
}

function login_(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    //return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
	return fetch(`/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
