-- CreateTable
CREATE TABLE "User" (
    "ID" SERIAL NOT NULL,
    "Nom" TEXT NOT NULL,
    "Prenom" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Num" INTEGER NOT NULL,
    "Role" TEXT NOT NULL,
    "MotDePasse" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Service" (
    "ID" SERIAL NOT NULL,
    "Description" TEXT NOT NULL,
    "Prix" DOUBLE PRECISION NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "Titre" TEXT NOT NULL,
    "Image" TEXT NOT NULL,
    "Place" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "categorieId" INTEGER NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "ID" SERIAL NOT NULL,
    "DATE" TIMESTAMP(3) NOT NULL,
    "statut" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Favoris" (
    "ID" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,

    CONSTRAINT "Favoris_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Categorie" (
    "ID" SERIAL NOT NULL,
    "Nom" TEXT NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "ID" SERIAL NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "IDServ" INTEGER NOT NULL,
    "NumCarte" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favoris" ADD CONSTRAINT "Favoris_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favoris" ADD CONSTRAINT "Favoris_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
