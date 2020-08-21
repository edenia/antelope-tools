CREATE TABLE "public"."producer"("id" serial NOT NULL, "owner" varchar NOT NULL, "total_votes" varchar, "producer_key" varchar, "is_active" boolean, "url" varchar, "unpaid_blocks" integer, "last_claim_time" timestamptz, "location" integer, "producer_authority" jsonb, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , UNIQUE ("owner"));
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
CREATE TRIGGER "set_public_producer_updated_at"
BEFORE UPDATE ON "public"."producer"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_producer_updated_at" ON "public"."producer" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
