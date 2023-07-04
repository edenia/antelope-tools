CREATE  INDEX "block_history_timestamp_index" on
  "public"."block_history" using btree ("timestamp");
