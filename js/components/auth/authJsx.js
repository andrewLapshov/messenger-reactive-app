import Block from "../../block.js";
import { createElement } from "../../utils";
import FormList from "./form-listJsx.js";

const emailPattern = /[\w\-\.]{2,}@[\w-]{2,}(\.[\w-]{2,})?\.[\w-]{2,}/;

export default class Auth extends Block {
  constructor(props = { form: "login" }) {
    super({
      ...props,
      login: {
        title: "Вход",
        submitText: "Авторизоваться",
        linkText: "Нет аккаунта?",
        list: [
          {
            id: "email",
            type: "email",
            title: "Почта",
            pattern: emailPattern,
            error: "",
          },
          {
            id: "pass",
            type: "password",
            title: "Пароль",
            error: "",
          },
        ],
      },
      signin: {
        title: "Регистрация",
        submitText: "Зарегистрироваться",
        linkText: "Войти",
        list: [
          {
            id: "email",
            type: "email",
            title: "Почта",
          },
          {
            id: "login",
            type: "text",
            title: "Логин",
          },
          {
            id: "pass",
            type: "password",
            title: "Пароль",
          },
          {
            id: "pass_repeat",
            type: "password",
            title: "Пароль еще раз",
          },
        ],
      },
      error: "",
    });
  }

  handleChange(event) {
    console.log(event);
    const { target } = event;
    const { validity } = target;
    console.log(target.id);
    if (validity.patternMismatch) {
      this.props[this.props.form].list.some((item, idx) => {
        if (item.id === target.id) {
          this.setProps(this.props[this.props.form].list[idx].error);
          item.error = "Некорректно написано";
        }
      });
      console.log(this.props.login.list);
    }

    //
    // if (validity.valueMissing) {
    //   event.target.nextElementSibling.textContent = "Поле не заполнено";
    // } else if (validity.tooLong || validity.tooShort) {
    //   event.target.nextElementSibling.textContent = this.validationErrors.rangeError;
    // } else if (validity.typeMismatch) {
    //   event.target.nextElementSibling.textContent = this.validationErrors.linkError;
    // } else {
    //   event.target.nextElementSibling.textContent = "";
    // }
  }

  handleFormChange(e) {
    e.preventDefault();
    const { form } = this.props;
    if (form === "login") {
      this.setProps({ form: "signin" });
    } else {
      this.setProps({ form: "login" });
    }
  }

  componentDidMount(oldProps) {
    // setTimeout(() => this.setProps({ form: "signin" }), 3000);
  }

  render() {
    const { title, submitText, linkText, list } = this.props[this.props.form];

    return (
      <div className="login">
        <div className="login__wrapper">
          <h1 className="login__title">{title}</h1>
          <form className="login__form">
            <div class="login__input-field">
              <FormList
                formData={list}
                changeHandler={this.handleChange.bind(this)}
              />
            </div>
            <button className="login__button" type="submit">
              {submitText}
            </button>
            <button
              onClick={this.handleFormChange.bind(this)}
              className="login__link"
            >
              {linkText}
            </button>
          </form>
        </div>
      </div>
    );
  }
}
