
import { Page, Locator, expect } from '@playwright/test';
import { CONFIG } from '../utils/constants';

export class RecruitmentPage {
  readonly candidateRows: Locator;
  readonly candidateTable: Locator;

  constructor(
    private readonly page: Page,
    private readonly baseUrl: string = CONFIG.BASE_URL
  ) {
    this.candidateTable = page.locator('.oxd-table');
    this.candidateRows = page.locator('.oxd-table-card');
  }

  async acessarModulo(): Promise<void> {
    const url = `${this.baseUrl}${CONFIG.ROUTES.CANDIDATES}`;

    await this.page.goto(url);

    await expect(this.page).toHaveURL(url);

    await expect(
      this.page.getByRole('heading', {
        name: 'Candidates',
        exact: true,
      })
    ).toBeVisible();

    await expect(this.candidateTable).toBeVisible();
  }

  consultarCandidato(nomeCompleto: string): Locator {
    return this.candidateRows.filter({
      has: this.page.getByText(nomeCompleto, {
        exact: true,
      }),
    });
  }
}
