alter table "public"."stat" add column "average_cpu_usage_in_last_hour" numeric
 null default '0', add column "average_cpu_usage_in_last_day" numeric
 null default '0', add column "average_cpu_usage_in_last_week" numeric
 null default '0', add column "average_net_usage_in_last_hour" numeric
 null default '0', add column "average_net_usage_in_last_day" numeric
 null default '0', add column "average_net_usage_in_last_week" numeric
 null default '0';
