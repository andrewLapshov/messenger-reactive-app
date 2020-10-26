import { API } from "../../js/utils/HTTPTransport";
import * as Constants from "../endpoints/chatsEndpoints";

class ChatsClient {
  constructor(baseClient) {
    this.baseClient = baseClient;
  }

  getChats = () => this.baseClient.get(Constants.API_CHATS_GET_CHATS);

  createNewChat = () =>
    this.baseClient.post(Constants.API_CHATS_GET_CHATS, {
      data: { title: "some chat" },
    });
}

const chatsClient = new ChatsClient(API);
export default chatsClient;
