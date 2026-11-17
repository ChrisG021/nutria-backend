# NutriA+ — Backend

API do **NutriA+**, aplicativo de acompanhamento alimentar que permite registrar refeições e consultar informações nutricionais. O backend processa as requisições do aplicativo, consulta os alimentos, calcula os nutrientes de acordo com as quantidades informadas e armazena os registros no banco de dados.

A base de alimentos utiliza como referência a **Tabela Brasileira de Composição de Alimentos (TACO), 4ª edição**.

## Funcionalidades

- Consultar alimentos disponíveis na base de dados.
- Calcular informações nutricionais conforme a quantidade de cada alimento.
- Registrar refeições associadas a um usuário e seus alimentos.
- Consultar as refeições registradas, incluindo os alimentos e os nutrientes.
- Fornecer dados para o diário alimentar e os resumos de consumo do aplicativo.

> A identificação de alimentos por imagem com inteligência artificial foi iniciada como parte do projeto, mas a integração completa com a câmera não foi concluída. O registro disponível no aplicativo utiliza a seleção manual de alimentos.

## Tecnologias

- **Node.js** — ambiente de execução.
- **TypeScript** — linguagem de programação.
- **Fastify** — framework para a API.
- **Prisma ORM** — acesso ao banco de dados.
- **PostgreSQL e Supabase** — armazenamento dos dados.
- **Supabase Auth** — autenticação dos usuários no ecossistema do aplicativo.
- **Swagger/OpenAPI** — documentação da API.

## Como funciona

O aplicativo Flutter se comunica com a API por meio de requisições HTTP. No backend, as rotas recebem as solicitações, os serviços concentram o processamento e os repositórios acessam o banco de dados com o Prisma.

```text
Aplicativo Flutter → API Fastify → Serviços → Repositórios → PostgreSQL
```

As refeições são relacionadas aos usuários e aos alimentos consumidos. Os valores nutricionais são calculados a partir da quantidade informada para cada alimento.

### Principais estruturas de dados

| Estrutura | Finalidade |
| --- | --- |
| `auth.users` | Contas gerenciadas pelo Supabase Auth. |
| `foods` | Alimentos e informações nutricionais de referência. |
| `meals` | Refeições registradas e seus valores nutricionais totais. |
| `meal_food` | Alimentos de cada refeição, com peso e valores nutricionais correspondentes. |

## Executando o projeto

### Pré-requisitos

- Node.js e npm instalados.
- Projeto Supabase com banco PostgreSQL configurado.
- Credenciais e variáveis de ambiente exigidas pelo backend.

### Instalação e configuração

1. Clone o repositório e acesse a pasta do backend.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure um arquivo `.env` conforme as variáveis usadas no projeto. A conexão do Prisma com o PostgreSQL utiliza uma URL de banco; confira o nome exato da variável no `prisma.config.ts` e no arquivo que inicializa o Prisma Client.
4. Gere o Prisma Client:

   ```bash
   npx prisma generate
   ```

5. Consulte os comandos disponíveis e execute o script de desenvolvimento definido no `package.json`:

   ```bash
   npm run
   ```

Se o projeto possuir um script chamado `dev`, execute `npm run dev`. A porta configurada deve ser usada como endereço base para o aplicativo e para os testes da API.

> Não compartilhe o `.env` nem publique senhas, tokens ou chaves de API no repositório.

### Conexão com o Supabase

O endereço e as credenciais do banco podem ser obtidos no painel do Supabase, na opção **Connect**. Caso a rede não suporte a conexão direta por IPv6, a conexão **Session pooler** pode ser uma alternativa. Utilize a string fornecida pelo próprio projeto no Supabase e confira as credenciais antes de iniciar o backend.

Se for necessário sincronizar o schema local com um banco já existente, `npx prisma db pull` lê a estrutura do banco e pode modificar o arquivo `schema.prisma`. Faça uma cópia ou revise as alterações locais antes de executá-lo. Migrações devem ser revisadas separadamente antes de alterar o banco.

## Rotas identificadas

As rotas abaixo foram identificadas nos exemplos de execução do projeto. Consulte os arquivos de rotas e a documentação Swagger para verificar os contratos completos, parâmetros e demais endpoints disponíveis.

| Método | Rota | Finalidade |
| --- | --- | --- |
| `GET` | `/foods` | Consultar alimentos. |
| `GET` | `/meals/:userId` | Consultar as refeições de um usuário. |
| `POST` | `/foods/nutrients` | Processar dados nutricionais; a tentativa registrada no projeto também acionou a criação de uma refeição. Consulte a implementação para confirmar o corpo e o fluxo atuais. |

### Exemplo de retorno de refeições

O exemplo abaixo mostra uma **versão reduzida** do formato observado para a listagem de refeições:

```json
{
  "result": [
    {
      "id": "id-da-refeicao",
      "user_id": "id-do-usuario",
      "meal_type": "BREAKFAST",
      "created_at": "2026-11-17T08:52:44.293-03:00",
      "calories_kcal": "776",
      "carbohydrates_g": "102.7",
      "protein_g": "52.1",
      "fat_g": "17.9",
      "fiber_g": "8.4",
      "nutrients": {},
      "meal_food": [
        {
          "food_id": 533,
          "name": "Cuscuz",
          "weight_g": "400",
          "calories_kcal": "452",
          "nutrients": {}
        }
      ]
    }
  ]
}
```

Valores decimais podem chegar como **strings** na resposta JSON. Os dados de `nutrients` podem incluir valores numéricos e marcadores como `Tr` e `NA`; eles não devem ser tratados automaticamente como zero.

## Possíveis melhorias

- Concluir e testar o fluxo de câmera e reconhecimento de alimentos por imagem.
- Ampliar a cobertura de testes da API e da integração com o aplicativo.
- Revisar a autenticação e a autorização de acesso às refeições por usuário.
- Aprimorar o tratamento de erros e a apresentação de dados nutricionais incompletos.
- Desenvolver relatórios de evolução e acompanhamento nutricional.

## Referências

- [Tabela Brasileira de Composição de Alimentos — TACO, 4ª edição](https://nepa.unicamp.br/wp-content/uploads/sites/27/2023/10/taco_4_edicao_ampliada_e_revisada.pdf)
- [Documentação do Fastify](https://fastify.dev/docs/latest/)
- [Documentação do Prisma ORM](https://www.prisma.io/docs/orm/v7)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do PostgreSQL](https://www.postgresql.org/docs/)
