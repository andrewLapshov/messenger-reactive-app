import Block from '../../block.js';
import { authTmpl, formListTmpl } from './auth.tmpl.js';
import compile from '../compile.js';
import FormList from './form-list.js';

export default class Auth_old extends Block {
  constructor(props = { form: 'login' }) {
    super({
      ...props,
      login: {
        title: 'Вход',
        href: 'signin.html',
        submitText: 'Авторизоваться',
        linkText: 'Нет аккаунта?',
        list: [
          {
            id: 'email',
            type: 'email',
            title: 'Почта',
          },
          {
            id: 'pass',
            type: 'password',
            title: 'Пароль',
          },
        ],
      },
      signin: {
        title: 'Регистрация',
        href: 'login.html',
        submitText: 'Зарегистрироваться',
        linkText: 'Войти',
        list: [
          {
            id: 'email',
            type: 'email',
            title: 'Почта',
          },
          {
            id: 'login',
            type: 'text',
            title: 'Логин',
          },
          {
            id: 'pass',
            type: 'password',
            title: 'Пароль',
          },
          {
            id: 'pass_repeat',
            type: 'password',
            title: 'Пароль еще раз',
          },
        ],
      },
    });
  }

  handleFormChange(e) {
    e.preventDefault();
    const { form } = this.props;
    if (form === 'login') {
      this.setProps({ form: 'signin' });
    } else {
      this.setProps({ form: 'login' });
    }
  }

  componentDidMount(oldProps) {
    // setTimeout(() => this.setProps({ form: "signin" }), 3000);
  }

  render() {
    const { title, submitText, href, linkText, list } = this.props[this.props.form];

    return compile(authTmpl, {
      title,
      href,
      submitText,
      linkText,
      handleClick: this.handleFormChange.bind(this),
      // formList: new FormList({ list }).render(),
    });
  }
}
