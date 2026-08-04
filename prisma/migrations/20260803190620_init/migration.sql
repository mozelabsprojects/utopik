-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "countryName" TEXT NOT NULL,
    "turn" INTEGER NOT NULL DEFAULT 1,
    "budget" REAL NOT NULL DEFAULT 5000,
    "military" REAL NOT NULL DEFAULT 50,
    "happiness" REAL NOT NULL DEFAULT 50,
    "health" REAL NOT NULL DEFAULT 50,
    "environment" REAL NOT NULL DEFAULT 50,
    "education" REAL NOT NULL DEFAULT 50,
    "stability" REAL NOT NULL DEFAULT 50,
    "foreignRelations" REAL NOT NULL DEFAULT 50,
    "isGameOver" BOOLEAN NOT NULL DEFAULT false,
    "gameOverReason" TEXT,
    "isBankrupt" BOOLEAN NOT NULL DEFAULT false,
    "bankruptTurns" INTEGER NOT NULL DEFAULT 0,
    "currentEventId" TEXT,
    "usedEventIds" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "turn" INTEGER NOT NULL,
    CONSTRAINT "Investment_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
