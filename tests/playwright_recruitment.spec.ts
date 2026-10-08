
import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

import { PublicRecruitmentPage } from '../src/pages/PublicRecruitmentPage';
import { LoginPage } from '../src/pages/LoginPage';
import { RecruitmentPage } from '../src/pages/RecruitmentPage';
import { createCandidate } from '../src/data/candidateFactory';
import { CONFIG } from '../src/utils/constants';

test.describe('Recruitment - Candidatura Pública', () => {
  let publicPage: PublicRecruitmentPage;

  test.beforeEach(async ({ page }) => {
    publicPage = new PublicRecruitmentPage(page);

    await publicPage.acessarPaginaDeVagas();
    await publicPage.selecionarPrimeiraVaga();
  });

  test('REC-001 - Deve permitir preencher os dados de uma candidatura', async () => {
    const candidate = createCandidate();

    await publicPage.preencherDadosBasicos(
      candidate.firstName,
      candidate.middleName,
      candidate.lastName
    );

    await publicPage.preencherEmail(candidate.email);

    await expect(publicPage.inputFirstName).toHaveValue(
      candidate.firstName
    );

    await expect(publicPage.inputMiddleName).toHaveValue(
      candidate.middleName
    );

    await expect(publicPage.inputLastName).toHaveValue(
      candidate.lastName
    );

    await expect(publicPage.inputEmail).toHaveValue(
      candidate.email
    );
  });

  test('REC-002 - Deve validar o e-mail obrigatório', async () => {
    const candidate = createCandidate();

    await publicPage.preencherDadosBasicos(
      candidate.firstName,
      candidate.middleName,
      candidate.lastName
    );

    await publicPage.validarFormulario();

    await expect(publicPage.emailError).toBeVisible();
    await expect(publicPage.emailError).toHaveText('Required');

    await expect(publicPage.successMessage).not.toBeVisible();
  });

  test('REC-003 - Deve validar o formato do e-mail', async () => {
    const candidate = createCandidate();

    await publicPage.preencherDadosBasicos(
      candidate.firstName,
      candidate.middleName,
      candidate.lastName
    );

    await publicPage.preencherEmail('email-invalido');
    await publicPage.validarFormulario();

    await expect(publicPage.emailError).toBeVisible();
    await expect(publicPage.emailError).not.toBeEmpty();

    await expect(publicPage.successMessage).not.toBeVisible();
  });
});

test.describe('Recruitment - Consulta Interna', () => {
  test('REC-004 - Deve permitir acessar a listagem de candidatos', async ({ page }) => {
    test.skip(
      !CONFIG.CREDENTIALS.USERNAME ||
        !CONFIG.CREDENTIALS.PASSWORD,
      'Credenciais não configuradas.'
    );

    const loginPage = new LoginPage(page);
    const recruitmentPage = new RecruitmentPage(page);

    await loginPage.acessarSistema();

    await loginPage.fazerLogin(
      CONFIG.CREDENTIALS.USERNAME,
      CONFIG.CREDENTIALS.PASSWORD
    );

    await recruitmentPage.acessarModulo();

    await expect(recruitmentPage.candidateTable).toBeVisible();
  });
});

test.describe('Recruitment - Fluxo Completo', () => {
  test('REC-005 - Deve registrar candidatura e consultar no módulo interno', async ({ page }) => {
    const isolatedBaseUrl = (
      process.env.ORANGEHRM_ISOLATED_BASE_URL ?? ''
    ).replace(/\/$/, '');

    const resumePath = process.env.ORANGEHRM_TEST_RESUME
      ? resolve(process.env.ORANGEHRM_TEST_RESUME)
      : '';

    let isolatedUrlValid = false;

    try {
      const url = new URL(isolatedBaseUrl);

      const isPublicDemo =
        url.hostname === 'opensource-demo.orangehrmlive.com' ||
        url.hostname.endsWith('.opensource-demo.orangehrmlive.com');

      isolatedUrlValid =
        ['http:', 'https:'].includes(url.protocol) &&
        !isPublicDemo &&
        url.pathname === '/web/index.php' &&
        !url.username &&
        !url.password;
    } catch {
      isolatedUrlValid = false;
    }

    const canRun =
      process.env.ALLOW_CANDIDATE_CREATION === 'true' &&
      isolatedUrlValid &&
      Boolean(CONFIG.CREDENTIALS.USERNAME) &&
      Boolean(CONFIG.CREDENTIALS.PASSWORD) &&
      Boolean(resumePath) &&
      existsSync(resumePath);

    test.skip(
      !canRun,
      'Requer ambiente isolado autorizado, credenciais e currículo sintético.'
    );

    const publicPage = new PublicRecruitmentPage(
      page,
      isolatedBaseUrl
    );

    const loginPage = new LoginPage(
      page,
      isolatedBaseUrl
    );

    const recruitmentPage = new RecruitmentPage(
      page,
      isolatedBaseUrl
    );

    const candidate = createCandidate();

    await publicPage.acessarPaginaDeVagas();
    await publicPage.selecionarPrimeiraVaga();

    await publicPage.preencherDadosBasicos(
      candidate.firstName,
      candidate.middleName,
      candidate.lastName
    );

    await publicPage.preencherEmail(candidate.email);
    await publicPage.anexarCurriculo(resumePath);

    await publicPage.enviarCandidatura(canRun);

    await expect(publicPage.successMessage).toBeVisible();

    await loginPage.acessarSistema();

    await loginPage.fazerLogin(
      CONFIG.CREDENTIALS.USERNAME,
      CONFIG.CREDENTIALS.PASSWORD
    );

    await recruitmentPage.acessarModulo();

    const fullName = [
      candidate.firstName,
      candidate.middleName,
      candidate.lastName,
    ].join(' ');

    const candidateRow =
      recruitmentPage.consultarCandidato(fullName);

    await expect(candidateRow).toHaveCount(1);
    await expect(candidateRow).toBeVisible();
  });
});
