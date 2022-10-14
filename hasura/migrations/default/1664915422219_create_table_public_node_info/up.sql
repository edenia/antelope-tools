CREATE TABLE "public"."node_info" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "version" varchar NOT NULL, "features" jsonb NOT NULL DEFAULT jsonb_build_array(), "node_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("node_id") REFERENCES "public"."node"("id") ON UPDATE restrict ON DELETE cascade, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
