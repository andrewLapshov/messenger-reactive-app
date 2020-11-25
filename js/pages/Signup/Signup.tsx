import Block from '../../utils/Block/Block';
import { createElement, IProps } from '../../utils/createElement';
import Input from '../../components/Input/Input';
import Form from '../../components/Form/Form';
import validate from '../../utils/validate';
import router from '../../index';
import { ObjectOfString } from '../Settings/Settings';
import authClient from '../../../services/clients/authClient';

const emailPattern = /[\w\-\.]{2,}@[\w-]{2,}(\.[\w-]{2,})?\.[\w-]{2,}/;
const loginPattern = /[a-zA-Z!@#$%^&*_=+-]{3,32}/;
const passPattern = /.*/;
// const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{4,12}$/;

interface Errors {
  email: string;
  login: string;
  pass: string;
  passRepeat: string;
  form: string;
}

interface SignupProps {
  values: { email: string; login: string; pass: string; passRepeat: string };
  errors: Errors;
}

const defaultProps: SignupProps = {
  values: {
    // for dev
    email: 'test@mail.ru',
    login: 'middle_epta',
    pass: '123',
    passRepeat: '123',
  },
  errors: { email: '', login: '', pass: '', passRepeat: '', form: '' },
};

export default class Signup extends Block {
  relatedTarget: EventTarget | HTMLElement | null;

  constructor(props?: IProps) {
    super({
      ...props,
      ...defaultProps,
    });
    this.relatedTarget = null;
  }

  componentDidUpdate(oldProps: IProps, newProps: IProps): void {
    if (this.relatedTarget) {
      const currentForm = document.querySelector('.form_signup');
      if (this.relatedTarget instanceof HTMLElement) {
        const targetRef: HTMLElement | null | undefined = currentForm?.querySelector(`#${this.relatedTarget.id}`);
        this.relatedTarget.localName === 'button' ? targetRef?.click() : targetRef?.focus();
        this.relatedTarget = null;
      }
    }
  }

  clearErrors = (): void => {
    const clearErrors = Object.keys(this.props.errors).reduce((acc: ObjectOfString, key) => {
      acc[key] = '';
      return acc;
    }, {});
    this.setProps({ errors: { ...clearErrors } });
  };

  handleValidate(target: EventTarget): void {
    const { id: targetName, validity, value } = target as HTMLInputElement;

    let values = null;
    if (targetName === 'passRepeat') {
      values = [this.props.values.pass, value];
    }

    const errorMessage = validate(validity, values);
    this.setProps({
      errors: { ...this.props.errors, [targetName]: errorMessage },
      values: { ...this.props.values, [targetName]: value },
    });
  }

  handleBlur(event: FocusEvent) {
    const { target, relatedTarget } = event;
    const { id: targetName, value } = target as HTMLInputElement;

    if (value !== this.props.values[targetName]) {
      this.relatedTarget = relatedTarget;
      target && this.handleValidate(target);
    }
  }

  async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (event.target instanceof HTMLInputElement) {
      const inputs = event.target.querySelectorAll('input');
      inputs.forEach(input => {
        this.handleValidate(input);
      });
    }

    if (event.target instanceof HTMLInputElement && !event.target.checkValidity()) {
      return;
    } else {
      this.clearErrors();
    }

    const {
      values: { email, login, pass },
    } = this.props;
    try {
      await authClient.signup({ email, login, pass });
    } catch (err) {
      this.setProps({
        errors: { ...this.props.errors, form: err.response.reason },
      });
    }

    /*
     * test@mail.ru
     * middle_epta
     * 123
     * */
  }

  handleLink() {
    router.go('/login');
  }

  render() {
    const {
      values: { email: emailValue, login: loginValue, pass: passValue, passRepeat: passRepeatValue },
      errors: { email: emailError, login: loginError, pass: passError, passRepeat: passRepeatError, form: formError },
    } = this.props;

    return (
      // @ts-ignore
      <Form
        name="signinForm"
        title="Регистрация"
        submitText="Зарегистрироваться"
        linkText="Войти"
        className="form form_signup"
        linkHandler={this.handleLink.bind(this)}
        submitHandler={this.handleSubmit.bind(this)}
        error={formError}
      >
        {/*@ts-ignore*/}
        <Input
          id="email"
          type="email"
          label="Почта"
          pattern={emailPattern}
          value={emailValue}
          error={emailError}
          changeHandler={this.handleBlur.bind(this)}
          required
          className="login__input"
          wrapperClassName="input__wrapper"
          labelClassName="login__label"
          errorClassName="login__error"
        />
        {/*@ts-ignore*/}
        <Input
          id="login"
          type="text"
          label="Логин"
          pattern={loginPattern}
          value={loginValue}
          error={loginError}
          changeHandler={this.handleBlur.bind(this)}
          required
          className="login__input"
          wrapperClassName="input__wrapper"
          labelClassName="login__label"
          errorClassName="login__error"
        />
        {/*@ts-ignore*/}
        <Input
          id="pass"
          type="password"
          label="Пароль"
          pattern={passPattern}
          value={passValue}
          error={passError}
          changeHandler={this.handleBlur.bind(this)}
          required
          className={`login__input ${passError ? 'login__input_is-error' : ''}`}
          wrapperClassName="input__wrapper"
          labelClassName="login__label"
          errorClassName="login__error"
        />
        {/*@ts-ignore*/}
        <Input
          id="passRepeat"
          type="password"
          label="Пароль еще раз"
          pattern={passPattern}
          value={passRepeatValue}
          error={passRepeatError}
          changeHandler={this.handleBlur.bind(this)}
          required
          className={`login__input ${passError ? 'login__input_is-error' : ''}`}
          wrapperClassName="input__wrapper"
          labelClassName="login__label"
          errorClassName="login__error"
        />
      </Form>
    );
  }
}
