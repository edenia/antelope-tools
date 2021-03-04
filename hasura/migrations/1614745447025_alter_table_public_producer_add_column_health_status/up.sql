ALTER TABLE "public"."producer" ADD COLUMN "health_status" jsonb NULL DEFAULT jsonb_build_array();
