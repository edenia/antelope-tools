-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."stat" add column "nodes_summary" jsonb
 null default jsonb_build_object();
