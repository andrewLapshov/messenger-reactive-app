import Block from "../../utils/Block";
import { createElement } from "../../utils/createElement";

export default class ErrorComponent extends Block {
  constructor(props) {
    super(props);
  }

  handleClick() {
    const { linkHandler } = this.props;
    if (linkHandler) {
      linkHandler();
    }
  }

  render() {
    const { errorStatus, errorMessage, linkText } = this.props;
    return (
      <div className="error">
        <div className="error__wrapper">
          <h2 className="error__code">{errorStatus}</h2>
          <p className="error__text">{errorMessage}</p>
          <button
            type="button"
            onClick={this.handleClick.bind(this)}
            className="error__link"
          >
            {linkText}
          </button>
        </div>
      </div>
    );
  }
}
