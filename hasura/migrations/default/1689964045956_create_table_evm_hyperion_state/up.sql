CREATE TABLE "evm"."hyperion_state" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "last_synced_at" timestamptz NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
CREATE OR REPLACE FUNCTION "evm"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_evm_hyperion_state_updated_at"
BEFORE UPDATE ON "evm"."hyperion_state"
FOR EACH ROW
EXECUTE PROCEDURE "evm"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_evm_hyperion_state_updated_at" ON "evm"."hyperion_state" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
