import Block from "../../utils/Block";
import { createElement } from "../../utils/createElement";

export default class Form extends Block {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      className = "",
      submitText,
      linkText,
      linkHandler,
      submitHandler,
      children,
      error,
    } = this.props;

    return (
      <div className="login">
        <div className="login__wrapper">
          <h1 className="login__title">{title}</h1>
          <form
            className={`login__form ${className}`}
            noValidate
            onSubmit={submitHandler}
          >
            <div className="login__input-field">{children}</div>
            <button id="submit" type="submit" className="login__button">
              {submitText}
            </button>
            <button
              id="link"
              type="button"
              className="login__link"
              onClick={linkHandler}
            >
              {linkText}
            </button>
            {error && (
              <span className="login__error login__error_form">{error}</span>
            )}
          </form>
        </div>
      </div>
    );
  }
}
