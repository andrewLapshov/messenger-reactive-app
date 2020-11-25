import { API, HTTPTransport } from '../../js/utils/HTTPTransport';
import { ChatsEndpoints } from '../endpoints/chatsEndpoints';

class ChatsClient {
  constructor(private baseClient: HTTPTransport) {
    this.baseClient = baseClient;
  }

  getChats = () => this.baseClient.get(ChatsEndpoints.API_CHATS_GET_CHATS);

  createNewChat = () =>
    this.baseClient.post(ChatsEndpoints.API_CHATS_GET_CHATS, {
      data: { title: 'some chat' },
    });
}

const chatsClient = new ChatsClient(API);
export default chatsClient;
