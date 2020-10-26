import Block from "../../block";
import { createElement } from "../../utils";

export default class FormList extends Block {
  constructor(props) {
    super(props);
  }

  render() {
    const { formData, changeHandler } = this.props;
    return (
      <div>
        {formData.map((formItem) => {
          const { id, type, title, error, pattern = "" } = formItem;

          return (
            <div>
              <label htmlFor={id} className="login__label">
                {title}
              </label>
              <input
                className="login__input"
                type={type}
                id={id}
                onBlur={changeHandler}
                pattern={pattern}
              />
              <span className="error__message">{error}</span>
            </div>
          );
        })}
      </div>
    );
  }
}
