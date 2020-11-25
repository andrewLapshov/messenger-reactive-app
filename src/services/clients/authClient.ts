import { API, HTTPTransport } from '../../js/utils/HTTPTransport';
import { ObjectOfString } from '../../js/pages/Settings/Settings';
import { AuthEndpoints } from '../endpoints/authEndpoints';

interface authParams {
  email: string;
  login?: string;
  pass: string;
}

class AuthClient {
  private readonly headers: ObjectOfString;
  constructor(private baseClient: HTTPTransport) {
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  signup = ({ email, login, pass }: authParams) => {
    const data = JSON.stringify({
      first_name: 'New',
      second_name: 'user',
      login: login,
      email,
      password: pass,
      phone: '+77777777777',
    });

    return this.baseClient.post(AuthEndpoints.API_AUTH_SIGNUP, {
      data,
      headers: this.headers,
    });
  };

  signin = ({ email, pass }: authParams) => {
    const data = JSON.stringify({
      login: email,
      password: pass,
    });
    return this.baseClient.post(AuthEndpoints.API_AUTH_SIGNIN, {
      data,
      headers: this.headers,
    });
  };

  getUserInfo = () => this.baseClient.get(AuthEndpoints.API_AUTH_GET_USER_INFO);

  logout = () => this.baseClient.post(AuthEndpoints.API_AUTH_LOGOUT);
}

const authClient = new AuthClient(API);
export default authClient;
