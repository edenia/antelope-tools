alter table "public"."endpoint" add column "response" jsonb
 null default jsonb_build_object();
