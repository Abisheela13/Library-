
STEP 1 - POSTGRESQL
Create database:
librarydb

STEP 2 - BACKEND
cd backend
npm install

Open .env
Change postgres password correctly

Example:
DATABASE_URL="postgresql://postgres:1234@localhost:5432/librarydb"

Then run:

npx prisma generate
npx prisma migrate dev --name init
npm run dev

STEP 3 - FRONTEND

Open new terminal

cd frontend
npm install
npm run dev

STEP 4 - ADMIN LOGIN

First register user from frontend.

Then open PostgreSQL query tool and run:

UPDATE "User"
SET role='ADMIN'
WHERE email='admin@gmail.com';

Login again.
