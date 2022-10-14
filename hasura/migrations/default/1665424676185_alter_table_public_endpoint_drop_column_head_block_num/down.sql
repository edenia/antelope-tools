alter table "public"."endpoint" alter column "head_block_num" set default 0;
alter table "public"."endpoint" alter column "head_block_num" drop not null;
alter table "public"."endpoint" add column "head_block_num" int4;
