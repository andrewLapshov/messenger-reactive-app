import { API } from "../../js/utils/HTTPTransport";
import * as Constants from "../endpoints/authEndpoints";

class AuthClient {
  constructor(baseClient) {
    this.baseClient = baseClient;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  signup = ({ email, login, pass }) => {
    const data = JSON.stringify({
      first_name: "New",
      second_name: "user",
      login: login,
      email,
      password: pass,
      phone: "+77777777777",
    });

    return this.baseClient.post(Constants.API_AUTH_SIGNUP, {
      data,
      headers: this.headers,
    });
  };

  signin = ({ email, pass }) => {
    const data = JSON.stringify({
      login: email,
      password: pass,
    });
    return this.baseClient.post(Constants.API_AUTH_SIGNIN, {
      data,
      headers: this.headers,
    });
  };

  getUserInfo = () => this.baseClient.get(Constants.API_AUTH_GET_USER_INFO);

  logout = () => this.baseClient.post(Constants.API_AUTH_LOGOUT);
}

const authClient = new AuthClient(API);
export default authClient;
