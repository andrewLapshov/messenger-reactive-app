export const authTmpl = `<div class="login">
        <div class="login__wrapper">
          <h1 class="login__title">{{ title }}</h1>
          <form class="login__form">
<!--            <div class="login__input-field">-->
<!--             {{ formList }}-->
<!--            </div>-->
            <button class="login__button" type="submit">{{ submitText }}</button>
            <button onclick="{{ handleClick }}" class="login__link">{{ linkText }}</button>
          </form>
        </div>
      </div>`;

export const formListTmpl = `<label for={{ id }} class="login__label">{{ title }}</label>
    <input class="login__input" type={{ type }} id={{ id }} />`;
