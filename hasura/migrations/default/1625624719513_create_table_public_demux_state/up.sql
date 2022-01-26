CREATE TABLE "public"."demux_state" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "handler_version_name" varchar NOT NULL, "block_hash" varchar NOT NULL, "block_number" varchar NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
CREATE EXTENSION IF NOT EXISTS pgcrypto;
