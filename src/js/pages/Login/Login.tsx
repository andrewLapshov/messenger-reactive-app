import Block from '../../utils/Block/Block';
import { createElement, IProps } from '../../utils/createElement';
import Input from '../../components/Input/Input';
import Form from '../../components/Form/Form';
import validate from '../../utils/validate';
import router from '../../index';
import authClient from '../../../services/clients/authClient';

const emailPattern = /[\w\-\.]{2,}@[\w-]{2,}(\.[\w-]{2,})?\.[\w-]{2,}/;
const passPattern = /.*/;

interface LoginProps {
  values: { email: string; pass: string };
  errors: { email: string; pass: string };
}

const defaultProps: LoginProps = {
  // for dev
  values: { email: 'middle_epta', pass: '123' },
  errors: { email: '', pass: '' },
};

export default class Login extends Block {
  relatedTarget: EventTarget | HTMLElement | null;

  constructor(props?: IProps, tagName?: string) {
    super(
      {
        ...props,
        ...defaultProps,
      },
      tagName,
    );
    this.relatedTarget = null;
  }

  componentDidUpdate(oldProps: IProps, newProps: IProps): void {
    if (this.relatedTarget) {
      const currentForm = document.querySelector('.form_login');
      if (this.relatedTarget instanceof HTMLElement) {
        const targetRef: HTMLElement | null | undefined = currentForm?.querySelector(`#${this.relatedTarget.id}`);
        this.relatedTarget.localName === 'button' ? targetRef?.click() : targetRef?.focus();
        this.relatedTarget = null;
      }
    }
  }

  handleValidate(target: EventTarget): void {
    const { id: targetName, validity, value } = target as HTMLInputElement;

    const errorMessage = validate(validity);
    this.setProps({
      errors: { ...this.props.errors, [targetName]: errorMessage },
      values: { ...this.props.values, [targetName]: value },
    });
  }

  handleBlur(event: FocusEvent) {
    const { target, relatedTarget } = event;
    const { id: eventName, value } = target as HTMLInputElement;

    if (value !== this.props.values[eventName]) {
      this.relatedTarget = relatedTarget;
      target && this.handleValidate(target);
    }
  }

  async handleSubmit(event: Event) {
    event.preventDefault();

    if (event.target instanceof HTMLInputElement) {
      const inputs = event.target.querySelectorAll('input');
      inputs.forEach(input => {
        this.handleValidate(input);
      });
    }

    if (event.target instanceof HTMLInputElement && !event.target.checkValidity()) {
      return;
    }
    const {
      values: { email, pass },
    } = this.props;
    try {
      await authClient.signin({ email, pass });
      localStorage.setItem('isAuthorized', 'true');
      router.go('/chats');
    } catch (err) {
      console.log(err);
    }
  }

  handleLink() {
    router.go('/signup');
  }

  render() {
    const {
      values: { email: emailValue, pass: passValue },
      errors: { email: emailError, pass: passError },
    } = this.props;
    return (
      // @ts-ignore
      <Form
        name="loginForm"
        title="Вход"
        submitText="Авторизоваться"
        linkText="Нет аккаунта?"
        className="form form_login"
        linkHandler={this.handleLink.bind(this)}
        submitHandler={this.handleSubmit.bind(this)}
      >
        {/* @ts-ignore*/}
        <Input
          id="email"
          type="text"
          label="Почта"
          pattern={passPattern}
          // pattern={emailPattern}
          value={emailValue}
          error={emailError}
          required
          changeHandler={this.handleBlur.bind(this)}
          className="login__input"
          wrapperClassName="input__wrapper"
          labelClassName="login__label"
          errorClassName="login__error"
        />
        {/* @ts-ignore*/}
        <Input
          id="pass"
          type="password"
          label="Пароль"
          pattern={passPattern}
          value={passValue}
          error={passError}
          required
          changeHandler={this.handleBlur.bind(this)}
          className="login__input"
          wrapperClassName="input__wrapper"
          labelClassName="login__label"
          errorClassName="login__error"
        />
      </Form>
    );
  }
}
