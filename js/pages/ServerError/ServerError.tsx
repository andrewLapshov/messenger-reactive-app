import Block from '../../utils/Block/Block';
import { createElement, IProps } from '../../utils/createElement';
import ErrorComponent from '../../components/ErrorComponent/ErrorComponent';
import router from '../../index';

export default class ServerError extends Block {
  constructor(props?: IProps) {
    super(props);
  }

  handleLink(): void {
    router.go('/chats');
  }

  render() {
    return (
      // @ts-ignore
      <ErrorComponent
        errorStatus="500"
        errorMessage="Мы уже фиксим"
        linkText="Назад к чатам"
        linkHandler={this.handleLink.bind(this)}
      />
    );
  }
}
