import { authenticationService } from '../services/authenticationService';
import axios from 'axios';

export function handleResponse(response) {
    return response.text().then(text => {
        console.log(response);
        //const data = text && JSON.parse(text);
        const data = text;
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                authenticationService.logout();
                //location.reload(true);
            } else if([404].indexOf(response.status) !== -1) {
                alert('not found');
                return false;

            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}