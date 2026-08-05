CREATE TYPE "role" AS ENUM('admin', 'customer');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255),
	"role" "role" DEFAULT 'customer'::"role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
