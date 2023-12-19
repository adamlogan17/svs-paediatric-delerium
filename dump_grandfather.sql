--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE audit;
DROP DATABASE backup;
DROP DATABASE elearning;
DROP DATABASE test_database;




--
-- Drop roles
--

DROP ROLE admin;
DROP ROLE elearning_admin_role;
DROP ROLE elearning_field_engineer_role;
DROP ROLE field_engineer;
DROP ROLE learner_role;
DROP ROLE picu;
DROP ROLE postgres;
DROP ROLE test_user;


--
-- Roles
--

CREATE ROLE admin;
ALTER ROLE admin WITH SUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:S6qNl0XMfpIC3kwF2Fn6xA==$pi0EkkP4NF10M91jo+P9hKUcSJl+7tQXLIIRed064AA=:QJhlhVZz/TlLoFYpM7eFP51ESFbMsOATV0mtw1IgDe0=';
CREATE ROLE elearning_admin_role;
ALTER ROLE elearning_admin_role WITH SUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:N48H/0ZAGpwXbaZOQYYvlQ==$cX/Ymr6h2zeLPCPRIN89ikW5lqN7bR3w3x+uuSmQ5i0=:AonwSzUq3E40+Y/2h8/FBgPVlpp0VZ8eAx63ANVevrQ=';
CREATE ROLE elearning_field_engineer_role;
ALTER ROLE elearning_field_engineer_role WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:4z1y8X0iI6rqmPs638Mb2Q==$BvKjhsAdbv4o1WVHhEiRhduHYVciId9e3dikG+UjhrI=:dn9CD7+OSKb7ba0haPhsvjC5nsporTcr/kohjI5YYN0=';
CREATE ROLE field_engineer;
ALTER ROLE field_engineer WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:eBjLberOFn8mlZ57MgUd7w==$+EWhb6+SStPsUTYRHtTpXrNUpYfTwC3AHxaJYsfP9lQ=:hn+YCKHK6vkRmhf43n9pPMYm6yw7OSwySWH0pSP3C+k=';
CREATE ROLE learner_role;
ALTER ROLE learner_role WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:9YiNgYGN1NXh35b+IitItw==$mo0hAqdGZ6kt0ysjF3VJN1azxofhbqeVt9Kh6KZT5jQ=:F04qj58hIBFD5u2tGrR7KOoNwfRMs3sb8NYzJSN+wjg=';
CREATE ROLE picu;
ALTER ROLE picu WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:yJz0Kn6MHNc3IaY+MAJnXQ==$EuszVJIqcvZt5/tUEEhh9taY4l5J+3Jd2zSzBFMDKY8=:afiiNCQC4AsgUARHZz8WABl32WGPbgsFv7SaoGr6txw=';
CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:EerdY6qXqXyoZtgnFtX69Q==$8pXfiGt2YITMJvqIEBQ/9o9nWXnWK3RWjrrbsDs0Ppo=:iEVtWvTMSvuT0s+JKlVOqFrlptxhgkExdnF6v684ASM=';
CREATE ROLE test_user;
ALTER ROLE test_user WITH SUPERUSER INHERIT NOCREATEROLE CREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:Co3qPmWfrumY3s09AVuuUg==$psGqpQ5/Y/0FZa2HzVkIdN4droPZaJgTdXYei4S8O+g=:mpPzEls6wl4uwYQRG930fsDJoBIoTMZkt0CjdoonDqI=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.1 (Debian 16.1-1.pgdg120+1)

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

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO postgres;

\connect template1

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

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\connect template1

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

--
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: postgres
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "audit" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.1 (Debian 16.1-1.pgdg120+1)

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

--
-- Name: audit; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE audit WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE audit OWNER TO postgres;

\connect audit

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

--
-- Name: calculate_overall_score(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_overall_score() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    UPDATE picu SET overall_compliance=(SELECT AVG(score) FROM compliance_data WHERE picu_id=NEW.picu_id) WHERE picu_id=NEW.picu_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.calculate_overall_score() OWNER TO postgres;

--
-- Name: calculate_positive_delirium(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_positive_delirium() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    UPDATE picu SET delirium_positive_patients=(SELECT AVG(in_score_range::INTEGER) FROM compliance_data WHERE picu_id=NEW.picu_id) WHERE picu_id=NEW.picu_id;
    RETURN NEW;
END;

$$;


ALTER FUNCTION public.calculate_positive_delirium() OWNER TO postgres;

--
-- Name: calculate_score(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_score() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    UPDATE compliance_data SET score=(SELECT ((((correct_details::INTEGER + comfort_recorded::INTEGER
        + all_params_scored::INTEGER + totalled_correctly::INTEGER + observer_name::INTEGER)/5.0)* comfort_recorded::INTEGER)*100) 
        FROM compliance_data WHERE comp_id = NEW.comp_id) WHERE comp_id = NEW.comp_id;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.calculate_score() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: api_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_log (
    date date,
    "time" time without time zone,
    method character varying(10),
    url character varying(255),
    status integer,
    userip character varying(50),
    useragent character varying(255),
    username character varying(50),
    userrole character varying(50)
);


ALTER TABLE public.api_log OWNER TO postgres;

--
-- Name: compliance_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compliance_data (
    comp_id integer NOT NULL,
    entry_date date NOT NULL,
    method character varying(5) NOT NULL,
    bed_number integer NOT NULL,
    correct_details boolean NOT NULL,
    comfort_recorded boolean NOT NULL,
    comfort_above boolean NOT NULL,
    all_params_scored boolean NOT NULL,
    totalled_correctly boolean NOT NULL,
    in_score_range boolean NOT NULL,
    observer_name boolean NOT NULL,
    score numeric,
    picu_id integer NOT NULL,
    CONSTRAINT compliance_data_method_check CHECK (((method)::text = ANY (ARRAY[('SOSPD'::character varying)::text, ('CAPD'::character varying)::text])))
);


ALTER TABLE public.compliance_data OWNER TO postgres;

--
-- Name: compliance_data_comp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.compliance_data_comp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.compliance_data_comp_id_seq OWNER TO postgres;

--
-- Name: compliance_data_comp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.compliance_data_comp_id_seq OWNED BY public.compliance_data.comp_id;


--
-- Name: picu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.picu (
    picu_id integer NOT NULL,
    password character(60) NOT NULL,
    ward_name character varying NOT NULL,
    hospital_name character varying NOT NULL,
    auditor character varying NOT NULL,
    delirium_positive_patients numeric,
    picu_role character varying DEFAULT 'picu'::character varying NOT NULL,
    overall_compliance numeric,
    CONSTRAINT picu_picu_role_check CHECK (((picu_role)::text = ANY (ARRAY[('picu'::character varying)::text, ('admin'::character varying)::text, ('field_engineer'::character varying)::text])))
);


ALTER TABLE public.picu OWNER TO postgres;

--
-- Name: picu_picu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.picu_picu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.picu_picu_id_seq OWNER TO postgres;

--
-- Name: picu_picu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.picu_picu_id_seq OWNED BY public.picu.picu_id;


--
-- Name: compliance_data comp_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_data ALTER COLUMN comp_id SET DEFAULT nextval('public.compliance_data_comp_id_seq'::regclass);


--
-- Name: picu picu_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.picu ALTER COLUMN picu_id SET DEFAULT nextval('public.picu_picu_id_seq'::regclass);


--
-- Data for Name: api_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_log (date, "time", method, url, status, userip, useragent, username, userrole) FROM stdin;
\.


--
-- Data for Name: compliance_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compliance_data (comp_id, entry_date, method, bed_number, correct_details, comfort_recorded, comfort_above, all_params_scored, totalled_correctly, in_score_range, observer_name, score, picu_id) FROM stdin;
1	2023-11-19	SOSPD	1	t	t	t	t	t	t	t	100.00000000000000000000	2
2	2023-11-19	SOSPD	1	f	t	t	t	t	t	t	80.00000000000000000000	2
3	2023-11-19	CAPD	1	f	t	t	t	t	t	t	80.00000000000000000000	2
4	2023-11-19	SOSPD	1	f	t	t	t	t	t	t	80.00000000000000000000	1
5	2023-11-19	SOSPD	1	f	t	f	t	t	t	f	60.00000000000000000000	22
6	2023-11-19	SOSPD	1	f	t	t	f	t	f	t	60.00000000000000000000	1
7	1985-06-12	CAPD	361	f	t	f	t	t	f	t	80.00000000000000000000	1
8	2005-11-26	CAPD	365	t	f	f	t	t	f	t	0.00000000000000000000	1
9	1980-12-30	CAPD	166	t	f	t	f	f	f	t	0.00000000000000000000	1
10	1998-03-14	CAPD	181	t	f	f	t	f	f	f	0.00000000000000000000	1
11	1970-05-21	SOSPD	235	f	f	f	f	t	f	t	0.00000000000000000000	1
12	1981-11-17	SOSPD	266	f	t	f	t	t	t	f	60.00000000000000000000	1
13	1991-10-17	CAPD	211	t	t	f	f	t	t	f	60.00000000000000000000	1
14	2022-04-22	SOSPD	120	f	t	f	t	f	f	f	40.00000000000000000000	1
15	2015-02-08	SOSPD	86	t	f	t	f	t	t	t	0.00000000000000000000	1
16	2005-10-15	SOSPD	143	t	f	f	t	f	t	t	0.00000000000000000000	1
17	1987-10-07	SOSPD	303	t	f	f	f	f	f	f	0.00000000000000000000	1
18	1993-04-26	CAPD	143	t	f	t	f	t	f	f	0.00000000000000000000	1
19	2002-03-30	SOSPD	176	t	f	t	t	f	f	t	0.00000000000000000000	1
20	1973-01-19	CAPD	151	t	f	f	t	f	t	t	0.00000000000000000000	1
21	2015-10-25	CAPD	381	t	t	f	f	f	t	f	40.00000000000000000000	1
22	1972-01-16	SOSPD	159	t	f	f	t	f	f	t	0.00000000000000000000	1
23	1970-11-07	SOSPD	82	f	t	f	t	t	f	f	60.00000000000000000000	1
24	1979-12-30	SOSPD	382	f	f	f	t	f	f	t	0.00000000000000000000	1
25	2017-11-26	CAPD	219	f	t	f	f	f	t	t	40.00000000000000000000	1
26	2005-02-06	CAPD	19	t	f	f	f	t	t	f	0.00000000000000000000	1
\.


--
-- Data for Name: picu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.picu (picu_id, password, ward_name, hospital_name, auditor, delirium_positive_patients, picu_role, overall_compliance) FROM stdin;
3	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Maseru	Lesotho	Sam Matekane	\N	picu	\N
4	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Rabat	Morocco	Aziz Akhannouch	\N	picu	\N
5	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Riga	Latvia	Egils Levits	\N	picu	\N
6	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Ulaanbaatar	Mongolia	Luvsannamsrain Oyun-Erdene	\N	picu	\N
7	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Vaduz	Liechtenstein	Daniel Risch	\N	picu	\N
8	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Caracas	Venezuela	Nicolas Maduro	\N	picu	\N
9	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Riyadh	Saudi Arabia	Mohammed bin Salman	\N	picu	\N
10	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Riyadh	El Salvador	Nayib Bukele	\N	picu	\N
11	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Skopje	North Macedonia	Stevo Pendarovski	\N	picu	\N
12	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	South Tarawa	Kiribati	Taneti Maamau	\N	picu	\N
13	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Port of Spain	Trinidad and Tobago	Keith Rowley	\N	picu	\N
14	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Philipsburg	Sint Maarten	Silveria Jacobs	\N	picu	\N
15	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Port Louis	Mauritius	Pravind Jugnauth	\N	picu	\N
16	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	NDjamena	Chad	Saleh Kebzabo	\N	picu	\N
17	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Muscat	Oman	Haitham bin Tariq	\N	picu	\N
18	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Pago Pago	American Samoa	Lemanu Peleti Mauga	\N	picu	\N
19	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Papeete	French Polynesia	Edouard Fritch	\N	picu	\N
20	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Nuuk	Greenland	Julie Prast Wilche	\N	picu	\N
21	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Ottawa	Canada	Justin Trudeau	\N	picu	\N
23	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Nassau	Bahamas	Philip Davis	\N	picu	\N
24	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Adamstown	Pitcairn Islands	Iona Thomas	\N	admin	\N
25	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Adamstown	Pitcairn Islands	Iona Thomas	\N	field_engineer	\N
2	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Camp Thunder Cove	British Indian Ocean Territory	Paul Candler	1.00000000000000000000	picu	86.66666666666666666667
22	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Monrovia	Liberia	George Weah	1.00000000000000000000	picu	60.00000000000000000000
1	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Adamstown	Pitcairn Islands	Iona Thomas	0.40909090909090909091	picu	23.63636363636363636364
\.


--
-- Name: compliance_data_comp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.compliance_data_comp_id_seq', 26, true);


--
-- Name: picu_picu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.picu_picu_id_seq', 25, true);


--
-- Name: compliance_data compliance_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_data
    ADD CONSTRAINT compliance_data_pkey PRIMARY KEY (comp_id);


--
-- Name: picu picu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.picu
    ADD CONSTRAINT picu_pkey PRIMARY KEY (picu_id);


--
-- Name: compliance_data insert_calc_score; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER insert_calc_score AFTER INSERT ON public.compliance_data FOR EACH ROW EXECUTE FUNCTION public.calculate_score();


--
-- Name: compliance_data insert_overall_score; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER insert_overall_score AFTER INSERT ON public.compliance_data FOR EACH ROW EXECUTE FUNCTION public.calculate_overall_score();


--
-- Name: compliance_data insert_positive_delirium; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER insert_positive_delirium AFTER INSERT ON public.compliance_data FOR EACH ROW EXECUTE FUNCTION public.calculate_positive_delirium();


--
-- Name: compliance_data update_calc_score; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_calc_score AFTER UPDATE OF correct_details, comfort_above ON public.compliance_data FOR EACH ROW EXECUTE FUNCTION public.calculate_score();


--
-- Name: compliance_data update_overall_score; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_overall_score AFTER UPDATE OF score ON public.compliance_data FOR EACH ROW EXECUTE FUNCTION public.calculate_overall_score();


--
-- Name: compliance_data update_positive_delirium; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_positive_delirium AFTER UPDATE OF score ON public.compliance_data FOR EACH ROW EXECUTE FUNCTION public.calculate_positive_delirium();


--
-- Name: compliance_data fk_picu; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_data
    ADD CONSTRAINT fk_picu FOREIGN KEY (picu_id) REFERENCES public.picu(picu_id) ON DELETE CASCADE;


--
-- Name: TABLE compliance_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT ON TABLE public.compliance_data TO picu;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.compliance_data TO admin;


--
-- Name: SEQUENCE compliance_data_comp_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.compliance_data_comp_id_seq TO picu;


--
-- Name: TABLE picu; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.picu TO admin;
GRANT SELECT,UPDATE ON TABLE public.picu TO field_engineer;


--
-- PostgreSQL database dump complete
--

--
-- Database "backup" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.1 (Debian 16.1-1.pgdg120+1)

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

--
-- Name: backup; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE backup WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE backup OWNER TO postgres;

\connect backup

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
-- Name: api_log_backup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_log_backup (
    date date,
    "time" time without time zone,
    method character varying(10),
    url character varying(255),
    status integer,
    userip character varying(50),
    useragent character varying(255),
    username character varying(50),
    userrole character varying(50)
);


ALTER TABLE public.api_log_backup OWNER TO postgres;

--
-- Name: compliance_data_backup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compliance_data_backup (
    comp_id integer NOT NULL,
    entry_date date NOT NULL,
    method character varying(5) NOT NULL,
    bed_number integer NOT NULL,
    correct_details boolean NOT NULL,
    comfort_recorded boolean NOT NULL,
    comfort_above boolean NOT NULL,
    all_params_scored boolean NOT NULL,
    totalled_correctly boolean NOT NULL,
    in_score_range boolean NOT NULL,
    observer_name boolean NOT NULL,
    score numeric,
    picu_id integer NOT NULL,
    CONSTRAINT compliance_data_backup_method_check CHECK (((method)::text = ANY (ARRAY[('SOSPD'::character varying)::text, ('CAPD'::character varying)::text])))
);


ALTER TABLE public.compliance_data_backup OWNER TO postgres;

--
-- Name: compliance_data_backup_comp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.compliance_data_backup_comp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.compliance_data_backup_comp_id_seq OWNER TO postgres;

--
-- Name: compliance_data_backup_comp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.compliance_data_backup_comp_id_seq OWNED BY public.compliance_data_backup.comp_id;


--
-- Name: picu_backup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.picu_backup (
    picu_id integer NOT NULL,
    password character(60) NOT NULL,
    ward_name character varying NOT NULL,
    hospital_name character varying NOT NULL,
    auditor character varying NOT NULL,
    delirium_positive_patients numeric,
    picu_role character varying DEFAULT 'picu'::character varying NOT NULL,
    overall_compliance numeric,
    CONSTRAINT picu_backup_picu_role_check CHECK (((picu_role)::text = ANY (ARRAY[('picu'::character varying)::text, ('admin'::character varying)::text, ('field_engineer'::character varying)::text])))
);


ALTER TABLE public.picu_backup OWNER TO postgres;

--
-- Name: picu_backup_picu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.picu_backup_picu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.picu_backup_picu_id_seq OWNER TO postgres;

--
-- Name: picu_backup_picu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.picu_backup_picu_id_seq OWNED BY public.picu_backup.picu_id;


--
-- Name: compliance_data_backup comp_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_data_backup ALTER COLUMN comp_id SET DEFAULT nextval('public.compliance_data_backup_comp_id_seq'::regclass);


--
-- Name: picu_backup picu_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.picu_backup ALTER COLUMN picu_id SET DEFAULT nextval('public.picu_backup_picu_id_seq'::regclass);


--
-- Data for Name: api_log_backup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_log_backup (date, "time", method, url, status, userip, useragent, username, userrole) FROM stdin;
\.


--
-- Data for Name: compliance_data_backup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compliance_data_backup (comp_id, entry_date, method, bed_number, correct_details, comfort_recorded, comfort_above, all_params_scored, totalled_correctly, in_score_range, observer_name, score, picu_id) FROM stdin;
\.


--
-- Data for Name: picu_backup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.picu_backup (picu_id, password, ward_name, hospital_name, auditor, delirium_positive_patients, picu_role, overall_compliance) FROM stdin;
\.


--
-- Name: compliance_data_backup_comp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.compliance_data_backup_comp_id_seq', 1, false);


--
-- Name: picu_backup_picu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.picu_backup_picu_id_seq', 1, false);


--
-- Name: compliance_data_backup compliance_data_backup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_data_backup
    ADD CONSTRAINT compliance_data_backup_pkey PRIMARY KEY (comp_id);


--
-- Name: picu_backup picu_backup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.picu_backup
    ADD CONSTRAINT picu_backup_pkey PRIMARY KEY (picu_id);


--
-- Name: compliance_data_backup fk_picu; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_data_backup
    ADD CONSTRAINT fk_picu FOREIGN KEY (picu_id) REFERENCES public.picu_backup(picu_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- Database "elearning" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.1 (Debian 16.1-1.pgdg120+1)

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

--
-- Name: elearning; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE elearning WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE elearning OWNER TO postgres;

\connect elearning

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
-- Name: chapters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chapters (
    chapter_id integer NOT NULL,
    chapter_name character varying NOT NULL,
    pass_score numeric NOT NULL,
    num_pages integer NOT NULL,
    course_id integer NOT NULL
);


ALTER TABLE public.chapters OWNER TO postgres;

--
-- Name: chapters_chapter_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chapters_chapter_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chapters_chapter_id_seq OWNER TO postgres;

--
-- Name: chapters_chapter_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chapters_chapter_id_seq OWNED BY public.chapters.chapter_id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    course_id integer NOT NULL,
    course_name character varying NOT NULL
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: courses_course_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_course_id_seq OWNER TO postgres;

--
-- Name: courses_course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_course_id_seq OWNED BY public.courses.course_id;


--
-- Name: enrollment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollment (
    enrollment_id integer NOT NULL,
    enrollment_date date NOT NULL,
    completed_date date,
    user_id integer NOT NULL,
    course_id integer NOT NULL
);


ALTER TABLE public.enrollment OWNER TO postgres;

--
-- Name: enrollment_enrollment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.enrollment_enrollment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enrollment_enrollment_id_seq OWNER TO postgres;

--
-- Name: enrollment_enrollment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.enrollment_enrollment_id_seq OWNED BY public.enrollment.enrollment_id;


--
-- Name: progression; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.progression (
    progression_id integer NOT NULL,
    score numeric,
    current_page integer NOT NULL,
    completed_date date,
    user_id integer NOT NULL,
    chapter_id integer NOT NULL
);


ALTER TABLE public.progression OWNER TO postgres;

--
-- Name: progression_progression_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.progression_progression_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.progression_progression_id_seq OWNER TO postgres;

--
-- Name: progression_progression_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.progression_progression_id_seq OWNED BY public.progression.progression_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying NOT NULL,
    password character(60) NOT NULL,
    forename character varying NOT NULL,
    surname character varying NOT NULL,
    profession character varying NOT NULL,
    country character varying NOT NULL,
    user_role character varying DEFAULT 'lerner'::character varying NOT NULL,
    CONSTRAINT users_user_role_check CHECK (((user_role)::text = ANY (ARRAY[('learner'::character varying)::text, ('admin'::character varying)::text, ('field_engineer'::character varying)::text])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: chapters chapter_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters ALTER COLUMN chapter_id SET DEFAULT nextval('public.chapters_chapter_id_seq'::regclass);


--
-- Name: courses course_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN course_id SET DEFAULT nextval('public.courses_course_id_seq'::regclass);


--
-- Name: enrollment enrollment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollment ALTER COLUMN enrollment_id SET DEFAULT nextval('public.enrollment_enrollment_id_seq'::regclass);


--
-- Name: progression progression_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.progression ALTER COLUMN progression_id SET DEFAULT nextval('public.progression_progression_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: chapters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chapters (chapter_id, chapter_name, pass_score, num_pages, course_id) FROM stdin;
1	in	66.36	26	1
2	labore	32.23	10	1
3	impedit	30.73	54	1
4	ab	35.77	69	1
5	quia	26.37	92	1
6	incidunt	24.72	72	1
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (course_id, course_name) FROM stdin;
1	veritatis
\.


--
-- Data for Name: enrollment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollment (enrollment_id, enrollment_date, completed_date, user_id, course_id) FROM stdin;
1	2020-11-28	\N	4	1
2	2011-08-03	\N	15	1
3	2017-11-06	\N	3	1
4	2021-04-11	\N	19	1
5	2011-06-05	\N	5	1
6	2009-05-16	\N	18	1
7	2000-10-13	\N	9	1
8	2012-03-20	\N	13	1
9	2004-01-16	\N	12	1
\.


--
-- Data for Name: progression; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.progression (progression_id, score, current_page, completed_date, user_id, chapter_id) FROM stdin;
1	38.27	37	2017-12-23	15	4
2	85.03	41	1992-12-13	11	4
3	84.23	19	2022-03-26	18	4
4	44.72	21	1975-07-31	6	3
5	64.4	47	1974-05-31	5	1
6	66.05	13	1983-12-04	4	1
7	74.05	31	2020-03-03	16	3
8	36.63	60	2016-03-26	13	3
9	24.04	40	1998-11-15	3	5
10	4.16	12	1982-07-29	6	1
11	20.51	33	1982-08-10	1	1
12	14.46	13	1975-06-22	14	4
13	72.99	49	2010-05-13	5	3
14	49.85	21	1991-06-18	19	5
15	21.7	8	1975-07-30	15	1
16	1.49	28	2018-06-19	16	5
17	29.27	63	1980-01-17	15	3
18	60.54	44	1973-01-02	13	2
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, password, forename, surname, profession, country, user_role) FROM stdin;
1	nigelmacdonald@example.org	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Graham	Reynolds	Designer, furniture	Slovenia	admin
2	edwardchapman@example.org	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Nigel	Bishop	Marine scientist	Dominica	learner
3	hughesgraham@example.com	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Kenneth	Fisher	Press photographer	United States Minor Outlying Islands	admin
4	thompsonabdul@example.net	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Marion	Barber	Clinical embryologist	Comoros	field_engineer
5	qhardy@example.com	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Colin	Carroll	Higher education lecturer	Andorra	learner
6	donna51@example.org	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Paula	Bentley	Drilling engineer	Kazakhstan	admin
7	gilesgordon@example.com	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Marie	Berry	Sound technician, broadcasting/film/video	United Kingdom	admin
8	elizabethcook@example.com	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Amelia	Davies	Adult guidance worker	Bosnia and Herzegovina	admin
9	geoffreymckenzie@example.com	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Lydia	Williams	Community development worker	Trinidad and Tobago	learner
10	aimeethompson@example.net	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Joshua	Turner	Accounting technician	Tajikistan	learner
11	kpearson@example.com	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Dominic	Short	Volunteer coordinator	Saint Helena	field_engineer
12	peter66@example.net	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Bethany	Bailey	Speech and language therapist	Micronesia	admin
13	coxjudith@example.org	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Grace	Parkinson	Mental health nurse	Puerto Rico	learner
14	gillian21@example.org	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Charlie	Walker	Research officer, trade union	Pitcairn Islands	learner
15	samantha40@example.com	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Lindsey	Jenkins	Civil engineer, contracting	Panama	field_engineer
16	wdaly@example.org	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Josephine	Alexander	Field trials officer	Palestinian Territory	admin
17	connormichael@example.net	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Tom	Evans	Microbiologist	Niger	learner
18	eileen07@example.net	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Fiona	Shaw	Mechanical engineer	Israel	learner
19	georginamiah@example.org	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Neil	Matthews	Cartographer	Nigeria	field_engineer
20	wboyle@example.org	$2a$10$QKROIDI35N4hIOQ1qwVwU.25ciIBjum/8mgQNEfzK.fMbMgJhUUUi	Reece	Sims	Designer, blown glass/stained glass	Sweden	field_engineer
\.


--
-- Name: chapters_chapter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chapters_chapter_id_seq', 6, true);


--
-- Name: courses_course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_course_id_seq', 1, true);


--
-- Name: enrollment_enrollment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enrollment_enrollment_id_seq', 9, true);


--
-- Name: progression_progression_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.progression_progression_id_seq', 18, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 20, true);


--
-- Name: chapters chapters_chapter_name_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_chapter_name_course_id_key UNIQUE (chapter_name, course_id);


--
-- Name: chapters chapters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_pkey PRIMARY KEY (chapter_id);


--
-- Name: courses courses_course_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_course_name_key UNIQUE (course_name);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (course_id);


--
-- Name: enrollment enrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT enrollment_pkey PRIMARY KEY (enrollment_id);


--
-- Name: enrollment enrollment_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT enrollment_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: progression progression_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.progression
    ADD CONSTRAINT progression_pkey PRIMARY KEY (progression_id);


--
-- Name: progression progression_user_id_chapter_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.progression
    ADD CONSTRAINT progression_user_id_chapter_id_key UNIQUE (user_id, chapter_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: progression fk_chapters; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.progression
    ADD CONSTRAINT fk_chapters FOREIGN KEY (chapter_id) REFERENCES public.chapters(chapter_id) ON DELETE CASCADE;


--
-- Name: chapters fk_courses; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT fk_courses FOREIGN KEY (course_id) REFERENCES public.courses(course_id) ON DELETE CASCADE;


--
-- Name: enrollment fk_courses; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT fk_courses FOREIGN KEY (course_id) REFERENCES public.courses(course_id) ON DELETE CASCADE;


--
-- Name: enrollment fk_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: progression fk_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.progression
    ADD CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: TABLE chapters; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.chapters TO elearning_admin_role;


--
-- Name: TABLE courses; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.courses TO elearning_admin_role;


--
-- Name: TABLE enrollment; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.enrollment TO learner_role;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.enrollment TO elearning_admin_role;


--
-- Name: SEQUENCE enrollment_enrollment_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.enrollment_enrollment_id_seq TO learner_role;


--
-- Name: TABLE progression; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.progression TO learner_role;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.progression TO elearning_admin_role;


--
-- Name: SEQUENCE progression_progression_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.progression_progression_id_seq TO learner_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.users TO elearning_admin_role;
GRANT SELECT,UPDATE ON TABLE public.users TO field_engineer;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.1 (Debian 16.1-1.pgdg120+1)

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

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

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

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- PostgreSQL database dump complete
--

--
-- Database "test_database" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.1 (Debian 16.1-1.pgdg120+1)

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

--
-- Name: test_database; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE test_database WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE test_database OWNER TO postgres;

\connect test_database

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
-- Name: test_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_table (
    id integer NOT NULL,
    name character varying(30),
    email character varying(30)
);


ALTER TABLE public.test_table OWNER TO postgres;

--
-- Name: test_table_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.test_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.test_table_id_seq OWNER TO postgres;

--
-- Name: test_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.test_table_id_seq OWNED BY public.test_table.id;


--
-- Name: test_table id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_table ALTER COLUMN id SET DEFAULT nextval('public.test_table_id_seq'::regclass);


--
-- Data for Name: test_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_table (id, name, email) FROM stdin;
1	Jerry	jerry@example.com
2	George	george@example.com
\.


--
-- Name: test_table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_table_id_seq', 2, true);


--
-- Name: test_table test_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_table
    ADD CONSTRAINT test_table_pkey PRIMARY KEY (id);


--
-- Name: TABLE test_table; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.test_table TO test_user;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

