alter table "public"."endpoint" add column "created_at" timestamptz
 null default now();
