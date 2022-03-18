CREATE TABLE IF NOT EXISTS public.covid_observations
(
    sno bigserial NOT NULL,
    observation_date date NOT NULL,
    province_state character varying COLLATE pg_catalog."default",
    country_region character varying COLLATE pg_catalog."default" NOT NULL,
    last_update date NOT NULL,
    confirmed bigint NOT NULL,
    deaths bigint NOT NULL,
    recovered bigint NOT NULL,
    CONSTRAINT covid_observations_pkey PRIMARY KEY (sno)
)