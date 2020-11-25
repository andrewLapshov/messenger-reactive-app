import Block from '../../utils/Block/Block';
import { createElement } from '../../utils/createElement';

interface InputProps {
  id: string;
  type: string;
  label?: string;
  value: string;
  error: string;
  pattern?: string;
  disabled?: boolean;
  required: boolean;
  placeholder?: string;
  changeHandler: <T = unknown, R = unknown>(args?: T) => R | void;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

export default class Input extends Block {
  constructor(props: InputProps) {
    super(props);
  }

  render() {
    const {
      id,
      type,
      label = '',
      value,
      error,
      pattern = '',
      disabled = false,
      required,
      placeholder = '',
      changeHandler,
      className,
      wrapperClassName = '',
      labelClassName = '',
      errorClassName = '',
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
