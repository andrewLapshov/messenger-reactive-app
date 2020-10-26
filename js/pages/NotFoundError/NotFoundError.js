import Block from "../../utils/Block";
import { createElement } from "../../utils/createElement";
import ErrorComponent from "../../components/ErrorComponent/ErrorComponent";
import router from "../../index";

export default class NotFoundError extends Block {
  constructor(props) {
    super(props);
  }

  handleLink() {
    router.go("/chats");
  }

  render() {
    return (
      <ErrorComponent
        errorStatus="404"
        errorMessage="Не туда попали"
        linkText="Назад к чатам"
        linkHandler={this.handleLink.bind(this)}
      />
    );
  }
}
