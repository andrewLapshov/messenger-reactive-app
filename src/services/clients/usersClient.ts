import { API, HTTPTransport } from '../../js/utils/HTTPTransport';
import { UsersEndpoints } from '../endpoints/usersEndpoints';
import { IUserInfoFields, ObjectOfString } from '../../js/pages/Settings/Settings';

class UsersClient {
  private readonly headers: ObjectOfString;
  constructor(private baseClient: HTTPTransport) {
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  changeUserAvatar = (file: string) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.baseClient.put(UsersEndpoints.API_USERS_CHANGE_USER_AVATAR, {
      data: formData,
    });
  };

  changeUserProfile = ({ firstName, secondName, displayName, login, email, phone }: IUserInfoFields) => {
    const data = JSON.stringify({
      first_name: firstName,
      second_name: secondName,
      display_name: displayName,
      login,
      email,
      phone,
    });

    return this.baseClient.put(UsersEndpoints.API_USERS_CHANGE_USER_PROFILE, {
      data,
      headers: this.headers,
    });
  };
}

const usersClient = new UsersClient(API);
export default usersClient;
