alter table "public"."stat" add column "unique_locations" jsonb
 null default jsonb_build_object();
