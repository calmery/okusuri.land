-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "screenName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile.userId_unique" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "UserProfile.screenName_index" ON "UserProfile"("screenName");

-- CreateIndex
CREATE INDEX "UserProfile.userId_index" ON "UserProfile"("userId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
