
import { Page, Locator, expect } from '@playwright/test';
import { CONFIG } from '../utils/constants';

export class LoginPage {
  readonly inputUsername: Locator;
  readonly inputPassword: Locator;
  readonly btnLogin: Locator;

  constructor(
    private readonly page: Page,
    private readonly baseUrl: string = CONFIG.BASE_URL
  ) {
    this.inputUsername = page.getByPlaceholder('Username');
    this.inputPassword = page.getByPlaceholder('Password');

    this.btnLogin = page.getByRole('button', {
      name: 'Login',
      exact: true,
    });
  }

  async acessarSistema(): Promise<void> {
    await this.page.goto(
      `${this.baseUrl}${CONFIG.ROUTES.LOGIN}`
    );

    await expect(this.inputUsername).toBeVisible();
  }

  async fazerLogin(
    usuario: string,
    senha: string
  ): Promise<void> {
    await this.inputUsername.fill(usuario);
    await this.inputPassword.fill(senha);
    await this.btnLogin.click();

    await expect(this.page).toHaveURL(
      new RegExp(CONFIG.ROUTES.DASHBOARD)
    );
  }
}
