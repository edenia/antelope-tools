ALTER TABLE "public"."missed_block" ADD COLUMN "producer" int4;
ALTER TABLE "public"."missed_block" ALTER COLUMN "producer" DROP NOT NULL;
ALTER TABLE "public"."missed_block" ADD CONSTRAINT missed_block_producer_fkey FOREIGN KEY (producer) REFERENCES "public"."producer" (id) ON DELETE cascade ON UPDATE cascade;
