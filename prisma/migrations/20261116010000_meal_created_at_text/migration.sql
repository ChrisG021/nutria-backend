ALTER TABLE "public"."meals"
  ALTER COLUMN "created_at" DROP DEFAULT,
  ALTER COLUMN "created_at" TYPE text
    USING to_char("created_at" AT TIME ZONE 'America/Fortaleza', 'YYYY-MM-DD"T"HH24:MI:SS.MS') || '-03:00';
