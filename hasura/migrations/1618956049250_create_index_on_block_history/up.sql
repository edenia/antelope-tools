CREATE INDEX block_history_timestamp_index ON block_history ("timestamp");
CREATE INDEX block_history_producer_index ON block_history ("producer");
CREATE INDEX block_history_timestamp_producer_index ON block_history ("timestamp", "producer");
