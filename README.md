# Gallery Share
## Deployment

### Environment Variables

Create a `.env` (local) and set the following on Vercel Project Settings:

```
NEXTAUTH_URL=
NEXTAUTH_SECRET=

DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>?sslmode=require

SUPABASE_URL=https://<project>.supabase.co
SUPABASE_ANON_KEY=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
```

### Vercel

- Connect this repo to Vercel.
- Framework preset: Next.js.
- Set env vars above.
- Build command: default.

### Supabase (database)

- Create a new Supabase project.
- Get connection string and set as `DATABASE_URL`.
- Run Prisma migrations:

```
npx prisma migrate deploy
```

### AWS S3

- Create an S3 bucket and enable public read for uploaded objects (or serve via signed URLs).
- Set `AWS_*` env vars and `AWS_S3_BUCKET`.


A modern Next.js 14 application with TypeScript and App Router for sharing and discovering art galleries.

## Features

- 🚀 Next.js 14 with App Router
- 📘 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🔍 ESLint for code quality
- 📱 Responsive design
- 🧭 Client-side navigation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
├── app/                    # App Router directory
│   ├── about/             # About page
│   ├── galleries/         # Galleries page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   └── Navigation.tsx     # Navigation component
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── next.config.js         # Next.js configuration
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Prisma** - Database ORM
- **NextAuth.js** - Authentication
- **AWS SDK** - Cloud services integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
