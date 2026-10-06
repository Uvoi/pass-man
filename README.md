# Pass-man

Pass-man is a web app for generating deterministic passwords and managing the
password records used to generate them. The generator works in the browser;
Pass-man stores its records in a backend database in encrypted form.

## Features

- Generate reproducible passwords from a master key, key, optional tag, and
  configurable parameters
- Save generated-password settings to Pass-man
- View, copy, edit, and delete saved records
- Encrypt record contents in the browser before sending them to the API
- Choose a custom character alphabet for password generation

## Requirements

- Node.js and npm
- Python 3.10 or newer
- PostgreSQL

## Setup

### Backend

Create a PostgreSQL database, then create the backend table:

```sql
CREATE TABLE password_items (
    id BIGSERIAL PRIMARY KEY,
    encrypted_data TEXT NOT NULL,
    iv TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Install and start the API:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env` with the connection URL for your PostgreSQL database:

```dotenv
DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@localhost:5432/DATABASE
```

Then run the development server from the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The API listens on `http://localhost:8000`. Its health endpoint is
`http://localhost:8000/api/health`.

### Frontend

In another terminal, install dependencies and start the Vite development
server:

```bash
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite (by default `http://localhost:5173`). The
development server proxies `/api` requests to the backend on port 8000.

## Using Pass-man

- Use the password generator on the home page to create a password from a
  master key, key, and optional tag.
- To save a generated record, enable the option to add it to Pass-man. You will
  be prompted for the Pass-man manager password.
- Open the manager with the **Pass-man** navigation option. Enter the manager
  password to decrypt and load the saved records.
- Use a record's actions to view or copy its generated password. Edit or
  delete records from the context menu.

The generator is also available at `/?page=pass-gen`; the manager is at
`/?page=pass-man`.

## Data and security

Record contents (the key, tag, and generation parameters) are encrypted in the
browser before being sent to the backend. Encryption uses a key derived from
the manager password with PBKDF2-HMAC-SHA-256 (120,000 iterations), and
AES-256-CTR with a random salt and counter for each record. The backend stores
the ciphertext, salt, and counter; it does not receive the manager password or
the generated passwords.

The current encryption format uses AES-CTR, which does not authenticate
ciphertext. This app should not be treated as a security-audited password
vault. Use a strong, unique manager password and protect the database and its
backups.

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Password derivation: Argon2 in the browser
- Backend: FastAPI, SQLAlchemy, PostgreSQL (asyncpg)

---

## Screenshots

### Pass-gen
![Pass-gen](assets/pm1.png)

### Pass-gen settings
![Pass-gen](assets/pm2.png)

### Pass-gen password
![Pass-gen](assets/pm3.png)

### Pass-man manager password
![Pass-gen](assets/pm4.png)

### Pass-man list
![Pass-gen](assets/pm5.png)

### Pass-man enter master key
![Pass-gen](assets/pm6.png)

### Pass-man show password
![Pass-gen](assets/pm7.png)

### Pass-man show custom alphabet
![Pass-gen](assets/pm8.png)

### Pass-man edit/delete item
![Pass-gen](assets/pm9.png)


