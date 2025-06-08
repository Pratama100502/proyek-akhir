import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import RegisterPage from '../pages/register/register-page';
import LoginPage from '../pages/login/login-page';
import DetailPage from '../pages/detail/detail-page'; // ini untuk lihat 1 story
import SavePage from '../pages/save-page/save-page';

console.log('HomePage', HomePage);

const LogoutPage = {
  async render() {
    localStorage.removeItem('token');
    window.location.href = '#/login';
    return '';
  },
  async afterRender() {}
};

const routes = {
  '/': HomePage,
  '/about': AboutPage,
  '/add-story': AddStoryPage,
  '/register': RegisterPage,
  '/login': LoginPage,
  '/detail/:id': DetailPage, 
  '/saved': SavePage,
  '/logout': LogoutPage, 
};

export default routes;
