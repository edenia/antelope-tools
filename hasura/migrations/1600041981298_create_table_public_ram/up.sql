CREATE TABLE "public"."ram"("id" serial NOT NULL, "producer" int4 NOT NULL, "usage" int4 NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("producer") REFERENCES "public"."producer"("id") ON UPDATE cascade ON DELETE cascade);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_ram_updated_at"
BEFORE UPDATE ON "public"."ram"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_ram_updated_at" ON "public"."ram" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
