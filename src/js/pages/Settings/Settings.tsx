import Block from '../../utils/Block/Block';
import { createElement, IProps } from '../../utils/createElement';
import router from '../../index';
import usersClient from '../../../services/clients/usersClient';
import Button from '../../components/Button/Button';
import validate from '../../utils/validate';
import Input from '../../components/Input/Input';
import { FormEvent } from 'react';
import authClient from '../../../services/clients/authClient';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

export interface ObjectOfString {
  [key: string]: string;
}

export interface IUserInfoFields {
  displayName: string;
  firstName: string;
  secondName: string;
  email: string;
  login: string;
  phone: string;
}

interface IUserInfo extends IUserInfoFields {
  avatar: string | null;
  id: string | null;
}

interface IFetchedUserInfo {
  avatar: string | null;
  display_name: string | null;
  email: string | null;
  first_name: string | null;
  second_name: string | null;
  id: string | null;
  login: string | null;
  phone: string | null;
}

interface SettingsProps {
  userInfo: IUserInfo;
  editValues: IUserInfo;
  errors: IUserInfoFields;
  avatarPreview: string | null;
  isEdit: boolean;
}

const defaultProps: SettingsProps = {
  userInfo: {
    avatar: null,
    displayName: '',
    email: '',
    firstName: '',
    secondName: '',
    id: null,
    login: '',
    phone: '',
  },
  editValues: {
    avatar: null,
    displayName: '',
    email: '',
    firstName: '',
    secondName: '',
    id: null,
    login: '',
    phone: '',
  },
  errors: {
    displayName: '',
    firstName: '',
    secondName: '',
    email: '',
    login: '',
    phone: '',
  },
  avatarPreview: null,
  isEdit: false,
};

export default class Settings extends Block {
  relatedTarget: EventTarget | HTMLElement | null;

  constructor(props?: IProps) {
    super({
      ...props,
      ...defaultProps,
    });
    this.relatedTarget = null;
  }

  async componentDidMount(): Promise<void> {
    try {
      const { data } = await authClient.getUserInfo();
      const structuredUserInfo = this.getStructuredUserInfo(data);

      this.setProps({
        userInfo: { ...structuredUserInfo },
        editValues: { ...structuredUserInfo },
      });
    } catch (err) {
      console.log(err);
    }
  }

  componentDidUpdate(): void {
    if (this.relatedTarget) {
      const currentForm = document.querySelector('.form_settings');
      if (this.relatedTarget instanceof HTMLElement) {
        const targetRef: HTMLElement | null | undefined = currentForm?.querySelector(`#${this.relatedTarget.id}`);
        this.relatedTarget.localName === 'button' ? targetRef?.click() : targetRef?.focus();
        this.relatedTarget = null;
      }
    }
  }
  getStructuredUserInfo(userInfo: IFetchedUserInfo): { [p: string]: string } {
    const { avatar, display_name, email, first_name, second_name, id, login, phone } = userInfo;

    const data = {
      avatar,
      displayName: display_name,
      email,
      firstName: first_name,
      secondName: second_name,
      id,
      login,
      phone,
    };

    return Object.entries(data).reduce((acc: { [key: string]: string }, [key, value]: [string, string | null]) => {
      acc[key] = value !== null ? value : '';
      return acc;
    }, {});
  }

  handleHistoryBack(): void {
    router.back();
  }

  async handleLogout(): Promise<void> {
    try {
      await authClient.logout();
      router.go('/login');
    } catch (err) {
      console.log(err);
    }
  }

  clearErrors = (): ObjectOfString => {
    return Object.keys(this.props.errors).reduce((acc: ObjectOfString, key) => {
      acc[key] = '';
      return acc;
    }, {});
  };

  enableEdit(): void {
    this.setProps({ isEdit: !this.props.isEdit });
  }

  disableEdit(data?: ObjectOfString): void {
    const userInfo = data ? data : this.props.userInfo;
    this.setProps({
      isEdit: !this.props.isEdit,
      editValues: { ...userInfo },
      userInfo: { ...userInfo },
      errors: { ...this.clearErrors() },
    });
  }

  handleValidate(target: EventTarget): void {
    const { id: targetName, validity, value } = target as HTMLInputElement;

    const errorMessage = validate(validity);
    this.setProps({
      errors: { ...this.props.errors, [targetName]: errorMessage },
      editValues: { ...this.props.editValues, [targetName]: value },
    });
  }

  handleBlur(event: FocusEvent): void {
    const { target, relatedTarget } = event;
    const { id: eventName, value } = target as HTMLInputElement;

    if (value !== this.props.editValues[eventName]) {
      this.relatedTarget = relatedTarget;
      target && this.handleValidate(target);
    }
  }

  handleAvatarChange(event?: HTMLInputEvent): void {
    const reader = new FileReader();
    if (event && event.target.files) {
      const fileData = event.target.files[0];
      reader.onloadend = (() => {
        this.setProps({ avatarPreview: reader.result });
      }).bind(this);

      if (fileData) {
        reader.readAsDataURL(fileData);
        this.setProps({
          editValues: { ...this.props.editValues, avatar: event.target.files[0] },
        });
      }
    }
  }

  async handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    const {
      userInfo,
      editValues,
      userInfo: { avatar },
      editValues: { avatar: avatarValue },
    } = this.props;
    const isFormChanged = Object.keys(editValues).some(key => {
      if (key === 'avatar') return false;
      return userInfo[key] !== editValues[key];
    });
    let results = null;

    if (isFormChanged) {
      try {
        const { data } = await usersClient.changeUserProfile(editValues);
        results = data;
      } catch (e) {
        console.log(e);
      }
    }

    if (avatar !== avatarValue) {
      try {
        const { data } = await usersClient.changeUserAvatar(avatarValue);
        results = data;
      } catch (e) {
        console.log(e);
      }
    }

    if (results) {
      const structuredUserInfo = this.getStructuredUserInfo(results);
      this.disableEdit(structuredUserInfo);
    }
  }

  getImgSrc(): string {
    const {
      avatarPreview,
      userInfo: { avatar },
    } = this.props;
    return avatarPreview ? avatarPreview : `https://ya-praktikum.tech${avatar}`;
  }

  render(): JSX.Element {
    const {
      editValues: {
        avatar: avatarValue,
        displayName: displayNameValue,
        email: emailValue,
        firstName: firstNameValue,
        secondName: secondNameValue,
        login: loginValue,
        phone: phoneValue,
      },
      errors: {
        displayName: displayNameError,
        firstName: firstNameError,
        secondName: secondNameError,
        email: emailError,
        login: loginError,
        phone: phoneError,
      },
      isEdit,
    } = this.props;

    const imgSrc = this.getImgSrc();

    return (
      <div className="main">
        <div className="aside">
          <button type="button" className="aside__link" onClick={this.handleHistoryBack.bind(this)}>
            Back
          </button>
        </div>
        <form className="settings form_settings" noValidate onSubmit={this.handleSubmit.bind(this)}>
          <div className="settings__wrapper">
            <label
              htmlFor="avatar"
              className={`settings__upload-input-label ${isEdit ? 'settings__upload-input-label_clickable' : ''}`}
            >
              {avatarValue && (
                <img
                  src={imgSrc}
                  alt="avatar"
                  className={`settings__image ${isEdit ? 'settings__image_is-upload' : ''}`}
                />
              )}
              {isEdit && (
                <span>
                  Upload avatar
                  <input
                    className="settings__upload-input"
                    type="file"
                    id="avatar"
                    accept="image/*"
                    // @ts-ignore
                    onChange={this.handleAvatarChange.bind(this)}
                  />
                </span>
              )}
            </label>
            {/*@ts-ignore*/}
            <Input
              id="displayName"
              type="text"
              pattern={/.*/}
              value={displayNameValue}
              error={displayNameError}
              disabled={!isEdit}
              required
              placeholder={(displayNameValue && '') || isEdit ? 'Enter display name' : 'No display name'}
              className="settings__name"
              wrapperClassName="settings__input-wrapper settings__input-wrapper_no-border"
              errorClassName="settings__error settings__error_centered"
              changeHandler={this.handleBlur.bind(this)}
            />

            <div className="settings__inputs">
              {/*@ts-ignore*/}
              <Input
                id="firstName"
                type="text"
                label="Имя"
                pattern={/.*/}
                value={firstNameValue}
                error={firstNameError}
                disabled={!isEdit}
                required
                className="settings__input"
                wrapperClassName="settings__input-wrapper"
                labelClassName="settings__label"
                errorClassName="settings__error"
                changeHandler={this.handleBlur.bind(this)}
              />
              {/*@ts-ignore*/}
              <Input
                id="secondName"
                type="text"
                label="Фамилия"
                pattern={/.*/}
                value={secondNameValue}
                error={secondNameError}
                disabled={!isEdit}
                required
                className="settings__input"
                wrapperClassName="settings__input-wrapper"
                labelClassName="settings__label"
                errorClassName="settings__error"
                changeHandler={this.handleBlur.bind(this)}
              />
              {/*@ts-ignore*/}
              <Input
                id="email"
                type="email"
                label="Почта"
                pattern={/.*/}
                value={emailValue}
                error={emailError}
                disabled={!isEdit}
                required
                className="settings__input"
                wrapperClassName="settings__input-wrapper"
                labelClassName="settings__label"
                errorClassName="settings__error"
                changeHandler={this.handleBlur.bind(this)}
              />
              {/*@ts-ignore*/}
              <Input
                id="phone"
                type="text"
                label="Телефон"
                pattern={/.*/}
                value={phoneValue}
                error={phoneError}
                disabled={!isEdit}
                required
                className="settings__input"
                wrapperClassName="settings__input-wrapper"
                labelClassName="settings__label"
                errorClassName="settings__error"
                changeHandler={this.handleBlur.bind(this)}
              />
              {/*@ts-ignore*/}
              <Input
                id="login"
                type="text"
                label="Логин"
                pattern={/.*/}
                value={loginValue}
                error={loginError}
                disabled={!isEdit}
                required
                className="settings__input"
                wrapperClassName="settings__input-wrapper settings__input-wrapper_no-border"
                labelClassName="settings__label"
                errorClassName="settings__error"
                changeHandler={this.handleBlur.bind(this)}
              />
            </div>

            {isEdit ? (
              <div className="settings__edit-button-wrapper">
                {/*@ts-ignore*/}
                <Button id="submit" type="submit">
                  Сохранить
                </Button>
                {/*@ts-ignore*/}
                <Button id="cancel" className="button_red" clickHandler={this.disableEdit.bind(this)}>
                  Отменить
                </Button>
              </div>
            ) : (
              <div className="settings__edit-button-wrapper">
                <button
                  type="button"
                  className="settings__edit-button settings__edit-button_blue"
                  onClick={this.enableEdit.bind(this)}
                >
                  Изменить данные
                </button>
                <hr className="settings__separator" />
                <button
                  type="button"
                  className="settings__edit-button settings__edit-button_red"
                  onClick={this.handleLogout.bind(this)}
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    );
  }
}
