
import { Page, Locator, expect } from '@playwright/test';
import { CONFIG } from '../utils/constants';

export class PublicRecruitmentPage {
  readonly btnApply: Locator;
  readonly inputFirstName: Locator;
  readonly inputMiddleName: Locator;
  readonly inputLastName: Locator;
  readonly inputEmail: Locator;
  readonly inputResume: Locator;
  readonly btnSubmit: Locator;
  readonly successMessage: Locator;
  readonly emailError: Locator;

  constructor(
    private readonly page: Page,
    private readonly baseUrl: string = CONFIG.BASE_URL
  ) {
    this.btnApply = page.getByRole('button', {
      name: 'Apply',
      exact: true,
    });

    this.inputFirstName = page.getByPlaceholder('First Name');
    this.inputMiddleName = page.getByPlaceholder('Middle Name');
    this.inputLastName = page.getByPlaceholder('Last Name');

    const emailGroup = page
      .locator('.oxd-input-group')
      .filter({
        has: page.getByText('Email', { exact: true }),
      });

    this.inputEmail = emailGroup.getByRole('textbox');

    this.emailError = emailGroup.locator(
      '.oxd-input-group__message'
    );

    this.inputResume = page.locator('input[type="file"]');

    this.btnSubmit = page.getByRole('button', {
      name: 'Submit',
      exact: true,
    });

    this.successMessage = page.locator(
      '.oxd-toast-content--success'
    );
  }

  async acessarPaginaDeVagas(): Promise<void> {
    await this.page.goto(
      `${this.baseUrl}${CONFIG.ROUTES.PUBLIC_JOBS}`
    );

    await expect(this.btnApply.first()).toBeVisible();
  }

  async selecionarPrimeiraVaga(): Promise<void> {
    await this.btnApply.first().click();

    await expect(this.inputFirstName).toBeVisible();
    await expect(this.inputLastName).toBeVisible();
    await expect(this.inputEmail).toBeVisible();
  }

  async preencherDadosBasicos(
    primeiroNome: string,
    nomeMeio: string,
    ultimoNome: string
  ): Promise<void> {
    await this.inputFirstName.fill(primeiroNome);
    await this.inputMiddleName.fill(nomeMeio);
    await this.inputLastName.fill(ultimoNome);
  }

  async preencherEmail(email: string): Promise<void> {
    await this.inputEmail.fill(email);
  }

  async anexarCurriculo(caminho: string): Promise<void> {
    await this.inputResume.setInputFiles(caminho);
  }

  async validarFormulario(): Promise<void> {
    await expect(this.btnSubmit).toBeVisible();
    await expect(this.btnSubmit).toBeEnabled();

    await this.btnSubmit.scrollIntoViewIfNeeded();
    await this.btnSubmit.click();
  }

  async enviarCandidatura(
    autorizado: boolean
  ): Promise<void> {
    const ambienteConfigurado = new URL(this.baseUrl);
    const ambienteAtual = new URL(this.page.url());

    const demoPublica = 'opensource-demo.orangehrmlive.com';

    const ambientePublico =
      ambienteAtual.hostname === demoPublica ||
      ambienteAtual.hostname.endsWith(`.${demoPublica}`);

    if (
      !autorizado ||
      ambientePublico ||
      ambienteAtual.origin !== ambienteConfigurado.origin ||
      !ambienteAtual.pathname.startsWith(
        `${ambienteConfigurado.pathname}/`
      )
    ) {
      throw new Error(
        'Envio bloqueado: ambiente não autorizado.'
      );
    }

    await this.validarFormulario();
  }
}
