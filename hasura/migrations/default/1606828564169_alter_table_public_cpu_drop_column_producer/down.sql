ALTER TABLE "public"."cpu" ADD COLUMN "producer" int4;
ALTER TABLE "public"."cpu" ALTER COLUMN "producer" DROP NOT NULL;
ALTER TABLE "public"."cpu" ADD CONSTRAINT cpu_producer_fkey FOREIGN KEY (producer) REFERENCES "public"."producer" (id) ON DELETE cascade ON UPDATE cascade;
