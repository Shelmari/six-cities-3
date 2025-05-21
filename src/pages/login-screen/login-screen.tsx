import { FormEvent, useRef, useState } from 'react';
import Header from '../../component/header/header';
import { useAppDispatch } from '../../hooks';
import { loginAction } from '../../store/api-actions';

const PASSWORD_ERROR_TEXT = 'The password must contain at least one letter and one number';

function LoginScreen(): JSX.Element {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const validatePassword = (password: string): boolean => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLetter && hasNumber;
  };


  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (loginRef.current !== null && passwordRef.current !== null) {
      const password = passwordRef.current.value;

      if (!validatePassword(password)) {
        setPasswordError(PASSWORD_ERROR_TEXT);
        return;
      }
      setPasswordError(null);
      dispatch(loginAction({
        email: loginRef.current.value,
        password,
      }));
    }
  };

  return (
    <div className="page page--gray page--login">
      <Header />

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form
              className="login__form form"
              action="#"
              method="post"
              onSubmit={handleSubmit}
            >
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  ref={loginRef}
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  ref={passwordRef}
                  className="login__input form__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={() => setPasswordError(null)}
                  required
                />
              </div>
              {passwordError && (
                <div className="login__error" style={{color: 'red', margin: '-20px 5px 5px', fontSize: '12px'}}>{passwordError}</div>
              )}
              <button
                className="login__submit form__submit button"
                type="submit"
              >
                Sign in
              </button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <a className="locations__item-link" href="#">
                <span>Amsterdam</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginScreen;

