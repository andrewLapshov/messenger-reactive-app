import Block from '../../utils/Block/Block';
import { createElement, IProps } from '../../utils/createElement';
import ErrorComponent from '../../components/ErrorComponent/ErrorComponent';
import router from '../../index';

export default class NotFoundError extends Block {
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
        errorStatus="404"
        errorMessage="Не туда попали"
        linkText="Назад к чатам"
        linkHandler={this.handleLink.bind(this)}
      />
    );
  }
}
