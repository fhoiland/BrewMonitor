--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    summary text NOT NULL,
    content text NOT NULL,
    image_url text,
    published boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: brewing_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brewing_data (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    kettle_temperature real NOT NULL,
    malt_temperature real NOT NULL,
    mode text NOT NULL,
    power integer NOT NULL,
    time_gmt text NOT NULL,
    fermenter_beer_type text NOT NULL,
    fermenter_temperature real NOT NULL,
    fermenter_gravity real NOT NULL,
    fermenter_total text NOT NULL,
    fermenter_time_remaining text NOT NULL,
    fermenter_progress integer NOT NULL,
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


--
-- Name: stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stats (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    total_batches integer NOT NULL,
    liters_produced integer NOT NULL,
    active_fermenters integer NOT NULL,
    days_since_last_batch integer NOT NULL,
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    username character varying NOT NULL,
    password character varying NOT NULL
);


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blog_posts (id, title, summary, content, image_url, published, created_at, updated_at) FROM stdin;
a8ad8316-9388-4493-bdc3-bc9a22e5789e	Første brygg med Prefab Brew Crew	En kort oppsummering av vårt første brygg sammen som gruppe	Hei bryggere! I dag deler vi historien om vårt aller første brygg som Prefab Brew Crew. Det var en lærerik opplevelse med mye skum, litt søl, og heldigvis også godt øl til slutt! Vi brukte en klassisk IPA-oppskrift og lærte masse underveis. Her er våre tips til andre nybegynnere...	/src/assets/first-brewing.png	t	2025-08-25 11:59:47.816187	2025-08-25 11:59:47.816187
c0e5a6ee-b3e4-478c-9e03-f512a5aca9a0	Tips for hjemmebrygging på vinteren	Hvordan opprettholde riktig temperatur når det er kaldt ute	Vinteren byr på unike utfordringer for hjemmebryggerene. Temperaturen kan påvirke gjæringen dramatisk, så her er våre beste tips for å brygge i kulda. Fra isolering til oppvarming - vi deler alt vi har lært!	/src/assets/winter-brewing.png	t	2025-08-25 11:59:48.872279	2025-08-25 11:59:48.872279
\.


--
-- Data for Name: brewing_data; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brewing_data (id, kettle_temperature, malt_temperature, mode, power, time_gmt, fermenter_beer_type, fermenter_temperature, fermenter_gravity, fermenter_total, fermenter_time_remaining, fermenter_progress, updated_at) FROM stdin;
eaccd37e-f52f-42b7-ac27-9199fdaaf5a3	65.5	68.2	Mashing	75	2024-08-25T10:30:00Z	IPA	20.1	1.045	23L	5 days	85	2025-08-25 11:56:45.425295
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (sid, sess, expire) FROM stdin;
\.


--
-- Data for Name: stats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stats (id, total_batches, liters_produced, active_fermenters, days_since_last_batch, updated_at) FROM stdin;
80ab22a4-c21c-4c68-bb0d-d829b9fec43e	47	1200	3	2	2025-08-25 11:56:46.470224
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, first_name, last_name, profile_image_url, created_at, updated_at, username, password) FROM stdin;
0c8ce9d1-1634-4525-91ec-b3d90e5b369f	\N	\N	\N	\N	2025-08-25 11:56:29.736525	2025-08-25 11:56:29.736525	admin	$2b$10$42fY5xVSpcfIAre64ZN62.hc8HNeMHICi5t6k4v6rvJDDAz64tyb.
\.


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: brewing_data brewing_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brewing_data
    ADD CONSTRAINT brewing_data_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: stats stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT stats_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- PostgreSQL database dump complete
--

