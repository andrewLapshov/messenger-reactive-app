import Block from '../../utils/Block/Block';
import { createElement } from '../../utils/createElement';

interface ButtonProps {
  id: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  children?: JSX.Element;
  title?: JSX.Element;
  clickHandler: <T = unknown, R = unknown>(args?: T) => R | void;
  value: string | boolean | number | { [key: string]: string };
}

export default class Button extends Block {
  constructor(props: ButtonProps) {
    super(props);
  }

  handleClick(): void {
    const { clickHandler, value } = this.props;
    if (clickHandler) {
      clickHandler(value);
    }
  }

  render(): JSX.Element {
    const { id, type = 'button', className = '', disabled = false, children, title = children } = this.props;
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
