import Block from '../../utils/Block/Block';
import { createElement, IProps } from '../../utils/createElement';
import ChatList from '../../components/ChatList/ChatList';
import Chat from '../../components/Chat/Chat';

export default class Chats extends Block {
  constructor(props?: IProps) {
    super(props);
  }

  render() {
    return (
      <div className="main main_chats">
        {/*@ts-ignore*/}
        <ChatList />
        {/*@ts-ignore*/}
        <Chat />
      </div>
    );
  }
}
