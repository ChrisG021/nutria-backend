# Nutria backend

## Banco de dados Supabase

No painel do Supabase, abra **Connect** e copie as URLs PostgreSQL do projeto para o arquivo `.env` (veja `.env.example`). Use `DATABASE_URL` para a conexão da aplicação e `DIRECT_URL` para comandos do Prisma. Para `DIRECT_URL`, use a conexão direta ou o pooler em modo session; a conexão direta pode exigir IPv6. Se `DIRECT_URL` não estiver definida, o Prisma CLI usa `DATABASE_URL`.

Substitua a senha e codifique caracteres especiais da URL quando necessário. Não compartilhe nem versione o arquivo `.env`.

Depois de configurar as URLs, execute `npx prisma generate` para gerar o cliente. O schema atual ainda não contém modelos: para um banco existente, use `npx prisma db pull` para importar as tabelas; para um banco novo, defina os modelos em `prisma/schema.prisma` antes de criar migrações.
