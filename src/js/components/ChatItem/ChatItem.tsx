import Block from '../../utils/Block/Block';
import { createElement } from '../../utils/createElement';

export interface IChatItemDataItem {
  id: string;
  title: string;
  avatar: string;
}

interface ChatItemProps {
  data: IChatItemDataItem;
}

export class ChatItem extends Block {
  constructor(props: ChatItemProps) {
    super(props);
  }

  render() {
    const { id, title, avatar } = this.props.data;
    return (
      <div className="chat-list__item">
        {avatar ? <img src={avatar} alt={avatar} className="chat-list__image" /> : <div className="chat-list__image" />}
        <div className="chat-list__info">
          <span className="chat-list__name">{title}</span>
          {/*<span className="chat-list__text">Изображение</span>*/}
          {/*<span className="chat-list__timestamp">10:49</span>*/}
          <span className="chat-list__unread">2</span>
        </div>
      </div>
    );
  }
}
