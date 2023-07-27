alter table "public"."round_history" 
drop column "updated_at",
drop column "started_at", 
drop column "produced_blocks";

alter table "public"."schedule_history" 
drop column "updated_at",
drop column "current", 
drop column "last_block",
drop column "last_block_at";
