
# Desafio Técnico QA Pleno — DBseller

## Automação de Testes — OrangeHRM

Projeto de automação de testes desenvolvido com Playwright e TypeScript para validar funcionalidades do módulo Recruitment do OrangeHRM.

A automação contempla a navegação pelas vagas públicas, o preenchimento de dados de candidatura, as validações de e-mail e a consulta à listagem interna de candidatos.

Os testes foram executados no ambiente público de demonstração do OrangeHRM. O envio de uma candidatura válida foi reservado para um ambiente isolado e autorizado, evitando a criação de registros no ambiente compartilhado.

## Tecnologias utilizadas

- Node.js e npm
- Playwright
- TypeScript
- Faker para geração de dados sintéticos
- dotenv para configuração opcional de variáveis de ambiente

## Pré-requisitos

- Node.js e npm instalados, em versões compatíveis com as dependências do projeto
- Acesso à internet
- Navegador Chromium instalado pelo Playwright

## Instalação

Abra um terminal na pasta raiz do projeto e execute:

```bash
npm ci
npx playwright install chromium
```

O comando `npm ci` utiliza as versões resolvidas no `package-lock.json`, facilitando a reprodução do ambiente de testes.

## Configuração

Para executar os testes no ambiente público de demonstração do OrangeHRM, não é necessário criar um arquivo `.env`.

O projeto utiliza, por padrão:

- URL: https://opensource-demo.orangehrmlive.com/web/index.php
- Usuário: Admin
- Senha: admin123

Essas credenciais são públicas e destinadas exclusivamente ao ambiente de demonstração do OrangeHRM.

Caso seja necessário utilizar outras configurações, copie o arquivo `.env.example` para `.env` e ajuste as variáveis conforme o ambiente autorizado.

Exemplo:

```env
ORANGEHRM_BASE_URL=https://opensource-demo.orangehrmlive.com/web/index.php
ORANGEHRM_USERNAME=Admin
ORANGEHRM_PASSWORD=admin123

ALLOW_CANDIDATE_CREATION=false
ORANGEHRM_ISOLATED_BASE_URL=
ORANGEHRM_TEST_RESUME=
```

O arquivo `.env` é opcional para a execução padrão e não deve ser incluído na entrega.

As credenciais públicas de demonstração não devem ser utilizadas como padrão em ambientes privados.

## Execução dos testes

Executar todos os testes:

```bash
npm test
```

Executar com o navegador visível:

```bash
npm run test:headed
```

Executar em modo interativo:

```bash
npm run test:ui
```

Verificar o código TypeScript:

```bash
npm run typecheck
```

Abrir o relatório HTML da última execução:

```bash
npm run test:report
```

## Cenários automatizados

| ID | Cenário | Resultado |
|---|---|---|
| REC-001 | Preencher os dados de uma candidatura e conferir os valores dos campos | Aprovado |
| REC-002 | Validar a obrigatoriedade do e-mail | Aprovado |
| REC-003 | Validar o formato inválido do e-mail | Aprovado |
| REC-004 | Acessar a listagem interna de candidatos | Aprovado |
| REC-005 | Enviar uma candidatura e consultar o candidato no módulo interno | Ignorado intencionalmente |

### Resultado da execução

Data: 08/10/2026

Ambiente: OrangeHRM Open Source Demo 5.9

Navegador: Chromium

```text
Running 5 tests using 1 worker

4 passed (18.0s)
1 skipped
0 failed
```

A verificação `npm run typecheck` também foi concluída sem erros.

Essa execução foi realizada sem o arquivo `.env`, confirmando que os quatro cenários habilitados podem ser executados com as configurações padrão.

Os resultados podem variar em execuções futuras, pois o OrangeHRM Demo é um ambiente público e compartilhado.

## Estratégia de automação

O projeto utiliza Page Object Model (POM), separando as interações com as páginas da definição dos cenários de teste.

Os dados de candidatos são gerados com Faker, utilizando informações sintéticas.

As validações utilizam as asserções do Playwright para verificar campos preenchidos, mensagens de erro e acesso à listagem de candidatos.

A execução é sequencial, com um worker, para facilitar a análise dos resultados.

## Limitações conhecidas

### REC-001 — Preenchimento da candidatura

O cenário verifica se os dados foram preenchidos corretamente no formulário público.

Não realiza o envio da candidatura nem valida sua persistência.

### REC-003 — Formato do e-mail

O cenário verifica a apresentação de uma mensagem de erro para um e-mail inválido, sem exigir um texto específico.

### REC-004 — Consulta interna

O cenário utiliza o acesso público de demonstração para consultar a listagem de candidatos.

Não cria, altera ou exclui registros.

### REC-005 — Fluxo completo

O cenário prevê o envio de uma candidatura com dados sintéticos e sua posterior localização no módulo interno.

Como esse procedimento cria registros, o teste permanece ignorado na demonstração pública.

Sua execução exige:

- Ambiente isolado e autorizado
- URL específica do ambiente de testes
- Credenciais válidas
- Currículo sintético para upload
- Habilitação explícita de `ALLOW_CANDIDATE_CREATION=true`

Uma URL diferente da demonstração pública não comprova, por si só, que o ambiente é isolado e autorizado.

A persistência do cadastro e sua posterior consulta ainda não foram validadas funcionalmente.

## Estratégia de limpeza

Em um ambiente isolado, os dados criados durante os testes devem ser identificáveis e removidos por procedimento autorizado após a execução.

Quando disponível, também poderá ser utilizada a restauração da base de testes.

A criação, a consulta e a limpeza devem ser registradas como evidências do fluxo completo.

## Estrutura do projeto

```text
Desafio_QA_DBSeller/
├── documentos/
│   ├── Atividade_1_Analise_Requisitos.pdf
│   ├── Atividade_2_Investigacao_Regressao_Evidencias.pdf
│   └── Atividade_3_Estrategia_Automacao.pdf
├── evidencias/
│   └── AT3-01_resultado_playwright.png
├── src/
│   ├── data/
│   │   └── candidateFactory.ts
│   ├── pages/
│   │   ├── LoginPage.ts
│   │   ├── PublicRecruitmentPage.ts
│   │   └── RecruitmentPage.ts
│   └── utils/
│       └── constants.ts
├── tests/
│   └── playwright_recruitment.spec.ts
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

A estrutura acima representa a organização prevista para o pacote de entrega.

## Evidências

A documentação das três atividades está organizada na pasta `documentos`.

A Atividade 1 apresenta a análise de requisitos, os cenários priorizados e as evidências da navegação.

A Atividade 2 apresenta a investigação de timesheets, a análise de regressão e as capturas de tela.

A Atividade 3 apresenta a estratégia de automação, os cenários, os resultados e as limitações.

O relatório HTML do Playwright pode ser gerado após a execução:

```bash
npm run test:report
```

O projeto também está configurado para gerar capturas de tela, vídeos e traces em caso de falha.

## Considerações finais

A automação foi desenvolvida com foco na organização do código, na reprodutibilidade dos testes e na utilização responsável do ambiente público de demonstração.

Os quatro cenários executados foram aprovados. O fluxo completo de cadastro e consulta permanece pendente de validação em ambiente isolado e autorizado.

O projeto pode ser instalado e executado sem configuração manual de credenciais para os cenários habilitados.
