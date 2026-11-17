-- Recreates the empty table; existing meal_food rows require a backup.
BEGIN;
CREATE TABLE "public"."meal_food" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "meal_id" UUID NOT NULL,
  "food_id" INTEGER NOT NULL,
  "weight_g" DECIMAL NOT NULL,
  "calories_kcal" DECIMAL NOT NULL DEFAULT 0,
  "carbohydrates_g" DECIMAL NOT NULL DEFAULT 0,
  "protein_g" DECIMAL NOT NULL DEFAULT 0,
  "fat_g" DECIMAL NOT NULL DEFAULT 0,
  "fiber_g" DECIMAL NOT NULL DEFAULT 0,
  "nutrients" JSONB NOT NULL DEFAULT '{}',
  "name" TEXT,
  CONSTRAINT "meal_food_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "meal_food_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "public"."foods"("taco_code") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "meal_food_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "public"."meals"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
CREATE INDEX "meal_food_meal_idx" ON "public"."meal_food"("meal_id");
COMMIT;
