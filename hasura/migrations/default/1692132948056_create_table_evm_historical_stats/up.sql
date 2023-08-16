CREATE TABLE "evm"."historical_stats" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "total_transactions" integer NOT NULL DEFAULT 0, "tps_all_time_high" jsonb NOT NULL DEFAULT jsonb_build_object(), "total_incoming_token" numeric NOT NULL DEFAULT 0, "total_outgoing_token" numeric NOT NULL DEFAULT 0, PRIMARY KEY ("id") , UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
