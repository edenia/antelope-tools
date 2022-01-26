CREATE TABLE "public"."block_history_by_producer_type" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "producer" varchar NOT NULL, "blocks" bigint NOT NULL, PRIMARY KEY ("id") );
CREATE EXTENSION IF NOT EXISTS pgcrypto;
