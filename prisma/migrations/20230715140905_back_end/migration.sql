-- AlterTable
CREATE SEQUENCE content_id_seq;
ALTER TABLE "Content" ALTER COLUMN "id" SET DEFAULT nextval('content_id_seq');
ALTER SEQUENCE content_id_seq OWNED BY "Content"."id";
