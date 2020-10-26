import Block from "../../utils/Block";
import { createElement } from "../../utils/createElement";
import ErrorComponent from "../../components/ErrorComponent/ErrorComponent";
import router from "../../index";

export default class ServerError extends Block {
  constructor(props) {
    super(props);
  }

  handleLink() {
    router.go("/chats");
  }

  render() {
    return (
      <ErrorComponent
        errorStatus="500"
        errorMessage="Мы уже фиксим"
        linkText="Назад к чатам"
        linkHandler={this.handleLink.bind(this)}
      />
    );
  }
}
