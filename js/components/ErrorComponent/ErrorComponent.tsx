import Block from '../../utils/Block/Block';
import { createElement } from '../../utils/createElement';

interface ErrorComponentProps {
  linkHandler?: <T = unknown, R = unknown>(args?: T) => R | void;
  errorStatus: string;
  errorMessage: string;
  linkText: string;
}

export default class ErrorComponent extends Block {
  constructor(props: ErrorComponentProps) {
    super(props);
  }

  handleClick(): void {
    const { linkHandler } = this.props;
    if (linkHandler) {
      linkHandler();
    }
  }

  render(): JSX.Element {
    const { errorStatus, errorMessage, linkText } = this.props;
    return (
      <div className="error">
        <div className="error__wrapper">
          <h2 className="error__code">{errorStatus}</h2>
          <p className="error__text">{errorMessage}</p>
          <button type="button" onClick={this.handleClick.bind(this)} className="error__link">
            {linkText}
          </button>
        </div>
      </div>
    );
  }
}
