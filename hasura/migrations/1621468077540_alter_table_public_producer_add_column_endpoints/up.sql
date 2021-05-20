alter table "public"."producer" add column "endpoints" jsonb
 null default jsonb_build_object();
