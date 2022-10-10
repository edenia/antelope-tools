alter table "public"."endpoint" alter column "updated_at" set default now();
alter table "public"."endpoint" alter column "updated_at" drop not null;
alter table "public"."endpoint" add column "updated_at" timetz;
