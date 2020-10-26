import Block from "../../utils/Block";
import { createElement } from "../../utils/createElement";
import router from "../../index";
import chatsClient from "../../../services/clients/chatsClient";
import { ChatItem } from "../ChatItem/ChatItem";

export default class ChatList extends Block {
  constructor(props) {
    super({ ...props, chats: [] });
  }

  async componentDidMount() {
    const { data } = await chatsClient.getChats();
    this.setProps({ chats: data });
  }

  handleCreateNewChat() {
    chatsClient.createNewChat().then((res) => console.log(res));
  }

  handleLink() {
    router.go("/settings");
  }

  render() {
    const { chats } = this.props;

    return (
      <div className="chat-list">
        <div className="chat-list__top">
          <div className="chat-list__item chat-list__item_search-bar">
            <button
              type="button"
              className="chat-list__link"
              onClick={this.handleLink.bind(this)}
            >
              Профиль >
            </button>
            <input type="text" className="search-bar" placeholder="Поиск" />
          </div>
          {chats.map((chat) => (
            <ChatItem data={chat} />
          ))}
          <div className="chat-list__item">
            <button
              type="button"
              className="chat-list__new-chat"
              onClick={this.handleCreateNewChat.bind(this)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    );
  }
}
