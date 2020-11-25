import Block from '../../utils/Block/Block';
import { createElement } from '../../utils/createElement';

export default class Chat extends Block {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <div className="chat">
        {/*<p class="chat__empty-text">Выберите чат чтобы отправить сообщение</p>*/}
        <div className="chat__top">
          <div className="chat__avatar" />
          <div className="chat__info">
            <span className="chat__name">Вадим</span>
            <span className="chat__last-seen">Был 5 минут назад</span>
          </div>
        </div>
        <div className="chat__feed">
          <div className="message message_out">
            <p className="message__text">Круто!</p>
            <span className="message__timestamp">12:00</span>
          </div>
        </div>
        <form className="chat__new-message">
          <input type="text" className="chat__new-message-input" placeholder="Сообщение" />
          <button className="chat__new-message-submit" type="button">
            {'>'}
          </button>
        </form>
      </div>
    );
  }
}
