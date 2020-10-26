import Block from "../../utils/Block";
import { createElement } from "../../utils/createElement";
import ChatList from "../../components/ChatList/ChatList";
import { API } from "../../utils/HTTPTransport";
import Chat from "../../components/Chat/Chat";

export default class Chats extends Block {
  constructor(props) {
    super(props);
  }

  componentDidMount(oldProps) {}

  render() {
    return (
      <div className="main main_chats">
        <ChatList />
        <Chat />
      </div>
    );
  }
}
