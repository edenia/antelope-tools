ALTER TABLE "public"."ram" ADD COLUMN "producer" int4;
ALTER TABLE "public"."ram" ALTER COLUMN "producer" DROP NOT NULL;
ALTER TABLE "public"."ram" ADD CONSTRAINT ram_producer_fkey FOREIGN KEY (producer) REFERENCES "public"."producer" (id) ON DELETE cascade ON UPDATE cascade;
