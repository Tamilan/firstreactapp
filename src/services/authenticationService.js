import { BehaviorSubject } from 'rxjs';

//import config from 'config';
import { handleResponse } from '../helpers/handleResponse';
import axios from "axios";
import http from './Request';
import LocalStorageService from './LocalStorageService';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

const localStorageService = LocalStorageService.getService();

export const authenticationService = {
    login,
    logout,
	is_valid,
    get_role,
    get_token,
    get_name,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value },
};

function is_valid() {
    let user = currentUserSubject.value;
    console.log(user);
    if(!user) {
        return false;
    }
    if(user.authenticated!==undefined && user.authenticated===true) {
        return true;
    }
    return false;
}

function get_token() {
    let user = currentUserSubject.value;
    //console.log(user);
    if(!user) {
        return null;
    }
    if(user.access_token!==undefined && user.access_token!=='') {
        return user.access_token;
    }
    return null;
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

function get_name() {
    let user = currentUserSubject.value;
    if(!user) {
        return null;
    }
    if(user.data!==undefined && user.data!=='') {
        return user.data.name;
    }
    return null;
}

function login_s3(user) {

    // const instance = axios.create({
    //     baseURL: 'http://localhost:3001',
    //     headers: {
    //         'X-Requested-With': 'XMLHttpRequest',
    //         'Content-Type': 'application/json',
    //     },
    // });

    return http.post('/auth', user
    //return instance.post('/auth', user
        // {
        //     params: {
        //     user
        //     }
        // }
        )
        .then(function (response) {
            console.log(response);
            if(response.data['status']!=undefined) {
                if(response.data['status']=='success') {
                    let user_data = response.data.data;
                    console.log(user_data);
                    localStorage.setItem('currentUser', JSON.stringify(user_data));
                    currentUserSubject.next(user_data);
                    localStorageService.setToken(user_data)
                } else {
                    alert(response.data['message']);
                }
            }
            
            
        })
        .catch(function (error) {
            alert(123);
            console.log(error);
        })
        .then(function () {
            // always executed
        });

	
}

function login(user) {


    let user_data = user;
    console.log(user_data);
    localStorage.setItem('currentUser', JSON.stringify(user_data));
    currentUserSubject.next(user_data);
    localStorageService.setToken(user_data)

    // return http.post('/auth', user)
    //     .then(function (response) {
    //         console.log(response);
    //         if(response.data['status']!=undefined) {
    //             if(response.data['status']=='success') {
    //                 let user_data = response.data.data;
    //                 console.log(user_data);
    //                 localStorage.setItem('currentUser', JSON.stringify(user_data));
    //                 currentUserSubject.next(user_data);
    //                 localStorageService.setToken(user_data)
    //             } else {
    //                 alert(response.data['message']);
    //             }
    //         }
            
    //     })
    //     .catch(function (error) {
    //         //alert(error);
    //         console.log(error);
    //         let data = error.response.data;
    //         alert(data.message);
    //     })
    //     .then(function () {
    //         // always executed
    //     });

	
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
    localStorageService.clearToken();
}
