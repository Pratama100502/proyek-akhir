import '../../../styles/auth.css';
import LoginPresenter from '../../presenters/LoginPresenter';

const LoginPage = {
  async render() {
    return `
      <div id="login-container">
        <h2>Login</h2>
        <form id="login-form">
          <input type="email" id="email" name="email" placeholder="Email" required />
          <input type="password" id="password" name="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <p id="register-link">Don't have an account? <a href="#/register">Register here</a></p>
      </div>
    `;
  },

  async afterRender() {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = form.email.value.trim();
      const password = form.password.value.trim();

      const presenter = new LoginPresenter();
      presenter.login(email, password);
    });
  }
};

export default LoginPage;