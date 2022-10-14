alter table "public"."endpoint" add column "updated_at" timestamptz
 null default now();
