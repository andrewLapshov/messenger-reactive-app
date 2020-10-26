import { API } from "../../js/utils/HTTPTransport";
import * as Constants from "../endpoints/usersEndpoints";

class UsersClient {
  constructor(baseClient) {
    this.baseClient = baseClient;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  changeUserAvatar = (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return this.baseClient.put(Constants.API_USERS_CHANGE_USER_AVATAR, {
      data: formData,
    });
  };

  changeUserProfile = ({
    firstName,
    secondName,
    displayName,
    login,
    email,
    phone,
  }) => {
    const data = JSON.stringify({
      first_name: firstName,
      second_name: secondName,
      display_name: displayName,
      login,
      email,
      phone,
    });

    return this.baseClient.put(Constants.API_USERS_CHANGE_USER_PROFILE, {
      data,
      headers: this.headers,
    });
  };
}

const usersClient = new UsersClient(API);
export default usersClient;
