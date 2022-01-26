CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."block_history"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "block_id" varchar NOT NULL, "block_num" integer NOT NULL, "transactions_length" integer NOT NULL, "timestamp" timestamptz NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , UNIQUE ("block_id"));
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
CREATE TRIGGER "set_public_block_history_updated_at"
BEFORE UPDATE ON "public"."block_history"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_block_history_updated_at" ON "public"."block_history" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
