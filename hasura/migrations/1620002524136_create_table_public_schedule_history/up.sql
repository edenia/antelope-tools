CREATE TABLE "public"."schedule_history" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "version" integer NOT NULL, "first_block_at" timestamptz NOT NULL, "last_block_at" timestamptz NOT NULL, "first_block" integer NOT NULL, "last_block" integer NOT NULL, "producers" jsonb NOT NULL DEFAULT jsonb_build_array(), "current" boolean NOT NULL, "round_interval" integer NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id"), UNIQUE ("version"));
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
CREATE TRIGGER "set_public_schedule_history_updated_at"
BEFORE UPDATE ON "public"."schedule_history"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_schedule_history_updated_at" ON "public"."schedule_history" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
