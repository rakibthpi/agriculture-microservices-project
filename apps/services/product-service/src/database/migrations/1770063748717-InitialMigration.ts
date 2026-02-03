import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1770063748717 implements MigrationInterface {
    name = 'InitialMigration1770063748717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "compare_price" numeric(10,2), "stock" integer NOT NULL DEFAULT '0', "unit" character varying NOT NULL DEFAULT 'kg', "sku" character varying, "image_url" character varying, "images" jsonb, "category_id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_featured" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "image_url" character varying, "is_active" boolean NOT NULL DEFAULT true, "display_order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
