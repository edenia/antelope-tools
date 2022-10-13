alter table "public"."endpoint" alter column "created_at" set default now();
alter table "public"."endpoint" alter column "created_at" drop not null;
alter table "public"."endpoint" add column "created_at" timetz;
