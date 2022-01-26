ALTER TABLE "public"."net" ADD COLUMN "producer" int4;
ALTER TABLE "public"."net" ALTER COLUMN "producer" DROP NOT NULL;
ALTER TABLE "public"."net" ADD CONSTRAINT net_producer_fkey FOREIGN KEY (producer) REFERENCES "public"."producer" (id) ON DELETE cascade ON UPDATE cascade;
