-- AlterTable: add roomNumber so rooms have a meaningful numeric identifier
ALTER TABLE "rooms" ADD COLUMN "roomNumber" INTEGER NOT NULL;

-- CreateIndex: enforce that the same room number cannot be reused for the same type
-- e.g. you cannot have two Deluxe rooms numbered 109
CREATE UNIQUE INDEX "rooms_roomNumber_type_key" ON "rooms"("roomNumber", "type");
