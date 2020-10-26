import Block from "../../utils/Block";
import { createElement } from "../../utils/createElement";
import Input from "../../components/Input/Input";
import Form from "../../components/Form/Form";
import validate from "../../utils/validate";
import router from "../../index";
import { API } from "../../utils/HTTPTransport";
import authClient from "../../../services/clients/authClient";

const emailPattern = /[\w\-\.]{2,}@[\w-]{2,}(\.[\w-]{2,})?\.[\w-]{2,}/;
const passPattern = /.*/;

export default class Login extends Block {
  constructor(props) {
    super({
      ...props,
      values: { email: "middle_epta", pass: "123" },
      errors: { email: "", pass: "" },
    });
    this.relatedTarget = null;
  }

  componentDidUpdate(oldProps, newProps) {
    if (this.relatedTarget) {
      const currentForm = document.querySelector(".form_login");
      const targetRef = currentForm.querySelector(`#${this.relatedTarget.id}`);
      this.relatedTarget.localName === "button"
        ? targetRef.click()
        : targetRef.focus();
      this.relatedTarget = null;
    }
  }

  handleValidate(target) {
    const { id: targetName, validity, value } = target;

    const errorMessage = validate(validity);
    this.setProps({
      errors: { ...this.props.errors, [targetName]: errorMessage },
      values: { ...this.props.values, [targetName]: value },
    });
  }

  handleBlur(event) {
    const { target, relatedTarget } = event;
    const { id: eventName, value } = target;

    if (value !== this.props.values[eventName]) {
      this.relatedTarget = relatedTarget;
      this.handleValidate(target);
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    const inputs = event.target.querySelectorAll("input");
    inputs.forEach((input) => {
      this.handleValidate(input);
    });

    if (!event.target.checkValidity()) {
      return;
    }
    const {
      values: { email, pass },
    } = this.props;
    try {
      await authClient.signin({ email, pass });
      localStorage.setItem("isAuthorized", "true");
      router.go("/chats");
    } catch (err) {
      console.log(err);
    }
  }

  handleLink() {
    router.go("/signup");
  }

  render() {
    const {
      values: { email: emailValue, pass: passValue },
      errors: { email: emailError, pass: passError },
    } = this.props;
    return (
      <Form
        name="loginForm"
        title="Вход"
        submitText="Авторизоваться"
        linkText="Нет аккаунта?"
        className="form form_login"
        linkHandler={this.handleLink.bind(this)}
        submitHandler={this.handleSubmit.bind(this)}
      >
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
