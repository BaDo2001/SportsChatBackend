-- AlterTable
CREATE SEQUENCE daysloaded_id_seq;
ALTER TABLE "DaysLoaded" ALTER COLUMN "id" SET DEFAULT nextval('daysloaded_id_seq');
ALTER SEQUENCE daysloaded_id_seq OWNED BY "DaysLoaded"."id";
