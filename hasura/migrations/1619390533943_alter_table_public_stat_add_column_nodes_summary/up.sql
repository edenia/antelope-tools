alter table "public"."stat" add column "nodes_summary" jsonb
 null default jsonb_build_object();
