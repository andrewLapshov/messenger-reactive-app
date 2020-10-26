import Block from "../../utils/Block";
import { createElement } from "../../utils/createElement";

export default class Button extends Block {
  constructor(props) {
    super(props);
  }

  handleClick() {
    const { clickHandler, value } = this.props;
    if (clickHandler) {
      clickHandler(value);
    }
  }

  render() {
    const {
      id,
      type = "button",
      className = "",
      disabled = false,
      children,
      title = children,
    } = this.props;
    return (
      <button
        id={id}
        type={type}
        title={title}
        className={`button ${className}`}
        onClick={this.handleClick.bind(this)}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}
