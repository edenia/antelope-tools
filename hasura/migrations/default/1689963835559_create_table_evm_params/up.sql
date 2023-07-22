CREATE TABLE "evm"."params" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "last_block_synced" numeric NOT NULL, PRIMARY KEY ("id") );
CREATE EXTENSION IF NOT EXISTS pgcrypto;
