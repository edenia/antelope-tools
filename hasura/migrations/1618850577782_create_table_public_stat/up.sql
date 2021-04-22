CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."stat"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "transactions_in_last_hour" Numeric NOT NULL DEFAULT 0, "transactions_in_last_day" numeric NOT NULL DEFAULT 0, "transactions_in_last_week" numeric NOT NULL DEFAULT 0, "average_daily_transactions_in_last_week" numeric NOT NULL DEFAULT 0, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_stat_updated_at"
BEFORE UPDATE ON "public"."stat"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_stat_updated_at" ON "public"."stat" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
