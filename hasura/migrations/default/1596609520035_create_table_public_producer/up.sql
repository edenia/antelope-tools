CREATE TABLE "public"."producer"(
  "id" serial NOT NULL,
  "owner" varchar NOT NULL,
  "total_votes" varchar,
  "producer_key" varchar,
  "is_active" boolean,
  "url" varchar,
  "unpaid_blocks" integer,
  "last_claim_time" timestamptz,
  "location" integer,
  "producer_authority" jsonb,
  "bp_json" jsonb,
  "server_version" varchar,
  "chain_id" varchar,
  "head_block_num" integer,
  "last_irreversible_block_num" integer,
  "last_irreversible_block_id" varchar,
  "head_block_id" varchar,
  "head_block_time" timestamptz,
  "head_block_producer" varchar,
  "virtual_block_cpu_limit" integer,
  "virtual_block_net_limit" integer,
  "block_cpu_limit" integer,
  "block_net_limit" integer,
  "server_version_string" varchar,
  "fork_db_head_block_num" integer,
  "fork_db_head_block_id" varchar,
  "server_full_version_string" varchar,
  "ping" integer,
  "total_votes_percent" numeric,
  "total_votes_eos" numeric,
  "block_rewards" numeric,
  "vote_rewards" numeric,
  "total_rewards" numeric,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  UNIQUE ("owner")
);
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
