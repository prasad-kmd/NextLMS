# Database & Auth Setup Required

To fully run the application, the following steps are required from the user:

1.  **Environment Variables**: Create a `.env` file in the root directory and add:
    - `DATABASE_URL`: Your PostgreSQL/Supabase connection string.
    - `DIRECT_URL`: Your direct connection string (if using Supabase).
    - `NEXTAUTH_SECRET`: A random string for session encryption.
2.  **Database Migration**: Run `pnpm prisma db push` to sync the schema with your database.
3.  **NextAuth Providers**: Currently, only Credentials provider is configured. For production, consider adding OAuth providers (GitHub, Google, etc.) in `src/lib/auth.ts`.
