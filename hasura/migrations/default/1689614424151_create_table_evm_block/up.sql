CREATE TABLE "evm"."block" ("hash" varchar NOT NULL, "gasUsed" numeric NOT NULL, "transactions" jsonb NOT NULL, "number" numeric NOT NULL, "timestamp" timestamptz NOT NULL, PRIMARY KEY ("hash") );
