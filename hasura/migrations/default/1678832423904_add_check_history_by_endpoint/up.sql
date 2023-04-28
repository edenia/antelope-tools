CREATE
OR REPLACE VIEW "public"."check_history_by_endpoint" AS
SELECT producer_id, value, endpoints_check_history.date, total_checks, (sum_total_time / total_checks) as avg_time, ((successful_checks * 100) / total_checks) as availability
  FROM
    (
      endpoints_check_history
      JOIN health_check_history ON ((endpoints_check_history.date = health_check_history.date))
    )
    ORDER BY endpoints_check_history.date ASC, availability DESC, avg_time ASC
 ;
