import '../../../styles/auth.css';
import RegisterPresenter from '../../presenters/RegisterPresenter';

const RegisterPage = {
  async render() {
    return `
      <div id="register-container">
        <h2>Register</h2>
        <form id="register-form">
          <input type="text" id="name" name="name" placeholder="Full Name" required />
          <input type="email" id="email" name="email" placeholder="Email" required />
          <input type="password" id="password" name="password" placeholder="Password" required />
          <button type="submit">Register</button>
        </form>
        <p id="login-link">Already have an account? <a href="#/login">Login here</a></p>
      </div>
    `;
  },

  async afterRender() {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Cegah form reload

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value.trim();

      if (!name || !email || !password) {
        alert('Name, Email, and Password are required');
        return;
      }

      const presenter = new RegisterPresenter();
      presenter.register(name, email, password); // Panggil register presenter dengan data
    });
  }
};

export default RegisterPage;