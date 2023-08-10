alter table "evm"."incoming_transfer" add column "type" varchar
 not null default 'incoming';
