# Leilão Legal

Projeto 4 da matéria **Arquitetura e Tecnologias de Sistemas Web (DCC704)**.

Sistema de leilão online em tempo real: usuários dão lances em itens e veem o valor, o último lance e o tempo restante atualizarem instantaneamente para todos os participantes conectados, via WebSocket.

## Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **Realtime**: Socket.io (cliente) + Socket.io + Express (servidor, em `backend/`)
- **Dados**: SQLite via Prisma (`backend/prisma/`) — itens, usuários e histórico de lances persistem entre reinícios do servidor
- **Validação**: payloads dos eventos de socket (`bid`, `add_item`) validados com `zod` antes de tocar no banco

## Como rodar

O projeto tem **dois processos separados** que precisam rodar ao mesmo tempo: o frontend Next.js e o servidor Socket.io.

### 1. Configurar variáveis de ambiente

```bash
# na raiz do projeto
cp .env.example .env

# em backend/
cd backend
cp .env.example .env
```

### 2. Backend (servidor Socket.io — porta 3000)

```bash
cd backend
npm install
npx prisma migrate dev   # cria o banco SQLite local (backend/prisma/dev.db)
npm run db:seed          # popula com os itens de exemplo (backend/data.json)
npm run dev
```

### 3. Frontend (Next.js — porta 3001)

Em outro terminal, na raiz do projeto:

```bash
npm install
npm run dev
```

Acesse [http://localhost:3001](http://localhost:3001).

## Variáveis de ambiente

| Local | Variável | Descrição |
|---|---|---|
| `.env` (raiz) | `NEXT_PUBLIC_SOCKET_URL` | URL do servidor Socket.io consumida pelo frontend |
| `backend/.env` | `PORT` | Porta em que o servidor Socket.io escuta |
| `backend/.env` | `CORS_ORIGIN` | Origem (URL do frontend) liberada no CORS do servidor |
| `backend/.env` | `DATABASE_URL` | Conexão do Prisma com o banco SQLite local |

## Estrutura

```
app/                # páginas e entrypoint Next.js (App Router)
components/         # componentes React (Header, Grid, Login, AddProduct, DashBoard, Footer)
backend/            # servidor Socket.io
  lib/              # acesso a dados (Prisma), validação (zod) e regras do leilão
  prisma/           # schema, migrations e seed do banco SQLite
```

## Autor

Kelvin Araújo Ferreira ([@DilliKel](https://github.com/DilliKel))

## Licença

[MIT](./LICENSE)
