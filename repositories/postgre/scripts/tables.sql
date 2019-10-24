-- DROP TABLE public.employee;

CREATE TABLE public.employee
(
    id integer NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT employee_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- DROP TABLE public.skill;

CREATE TABLE public.skill
(
    id integer NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT skill_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- DROP TABLE public.employee_skill;

CREATE TABLE public.employee_skill
(
    "employeeId" integer NOT NULL,
    "skillId" integer NOT NULL,
    CONSTRAINT employee_skill_pkey PRIMARY KEY ("employee_id", "skill_id"),
    CONSTRAINT employee_fk FOREIGN KEY ("employee_id")
        REFERENCES public.employee (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT skill_fk FOREIGN KEY ("skill_id")
        REFERENCES public.skill (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;