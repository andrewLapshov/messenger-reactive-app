import Block from '../../utils/Block/Block';
import { createElement } from '../../utils/createElement';
import router from '../../index';
import chatsClient from '../../../services/clients/chatsClient';
import { ChatItem, IChatItemDataItem } from '../ChatItem/ChatItem';

interface ChatListProps {
  chats: IChatItemDataItem[];
}

export default class ChatList extends Block {
  constructor(props: ChatListProps) {
    super({ ...props, chats: [] });
  }

  async componentDidMount(): Promise<void> {
    const { data } = await chatsClient.getChats();
    this.setProps({ chats: data });
  }

  handleCreateNewChat(): void {
    // chatsClient.createNewChat().then(res => console.log(res));
  }

  handleLink(): void {
    router.go('/settings');
  }

  render() {
    const { chats } = this.props;

    return (
      <div className="chat-list">
        <div className="chat-list__top">
          <div className="chat-list__item chat-list__item_search-bar">
            <button type="button" className="chat-list__link" onClick={this.handleLink.bind(this)}>
              Профиль {'>'}
            </button>
            <input type="text" className="search-bar" placeholder="Поиск" />
          </div>
          {chats.map((chat: IChatItemDataItem) => (
            // @ts-ignore
            <ChatItem data={chat} />
          ))}
          <div className="chat-list__item">
            <button type="button" className="chat-list__new-chat" onClick={this.handleCreateNewChat.bind(this)}>
              +
            </button>
          </div>
        </div>
      </div>
    );
  }
}
