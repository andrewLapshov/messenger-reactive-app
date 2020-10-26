import Block from "../../utils/Block";
import { createElement } from "../../utils/createElement";

export default class Input extends Block {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      id,
      type,
      label = "",
      value,
      error,
      pattern = "",
      disabled = false,
      required,
      placeholder = "",
      changeHandler,
      className,
      wrapperClassName = "",
      labelClassName = "",
      errorClassName = "",
    } = this.props;

    return (
      <div className={wrapperClassName}>
        {label && (
          <label htmlFor={id} className={labelClassName}>
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          pattern={pattern.toString().slice(1, -1)}
          value={value}
          className={className}
          onBlur={changeHandler}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
        />
        {error && <span className={errorClassName}>{error}</span>}
      </div>
    );
  }
}
