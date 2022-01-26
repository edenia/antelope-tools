alter table "public"."demux_state" alter column "block_number" drop not null;
alter table "public"."demux_state" add column "block_number" varchar;
