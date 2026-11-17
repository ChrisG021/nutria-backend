ALTER TABLE "public"."meals"
  ADD COLUMN "calories_kcal" DECIMAL NOT NULL DEFAULT 0,
  ADD COLUMN "carbohydrates_g" DECIMAL NOT NULL DEFAULT 0,
  ADD COLUMN "protein_g" DECIMAL NOT NULL DEFAULT 0,
  ADD COLUMN "fat_g" DECIMAL NOT NULL DEFAULT 0,
  ADD COLUMN "fiber_g" DECIMAL NOT NULL DEFAULT 0,
  ADD COLUMN "nutrients" JSONB NOT NULL DEFAULT '{}';

ALTER TABLE "public"."meal_food"
  ADD COLUMN "fiber_g" DECIMAL NOT NULL DEFAULT 0,
  ADD COLUMN "nutrients" JSONB NOT NULL DEFAULT '{}';

UPDATE "public"."meals" AS meal
SET "calories_kcal" = totals.calories_kcal,
    "carbohydrates_g" = totals.carbohydrates_g,
    "protein_g" = totals.protein_g,
    "fat_g" = totals.fat_g
FROM (
  SELECT "meal_id", SUM("calories_kcal") AS calories_kcal,
         SUM("carbohydrates_g") AS carbohydrates_g,
         SUM("protein_g") AS protein_g, SUM("fat_g") AS fat_g
  FROM "public"."meal_food"
  GROUP BY "meal_id"
) AS totals
WHERE meal."id" = totals.meal_id;
