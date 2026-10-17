ALTER TABLE "Profile" ADD COLUMN "focusTitle" TEXT NOT NULL DEFAULT 'Multimodal RAG';
ALTER TABLE "Profile" ADD COLUMN "specializations" JSONB NOT NULL DEFAULT '[]';
