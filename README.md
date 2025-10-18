## PharmaTrack
# Ecrans: 
<img width="1885" height="878" alt="Capture d'écran 2025-10-18 173909" src="https://github.com/user-attachments/assets/c49fd592-db48-4dee-b0f0-55a552262900" />

<img width="1788" height="902" alt="liste vente" src="https://github.com/user-attachments/assets/6c3b22d9-3f64-422d-9b21-8dad437cdb88" />

<img width="1867" height="873" alt="liste medicament" src="https://github.com/user-attachments/assets/fc1e77af-a99c-46bc-82dd-4d8a0d3861b1" />

<img width="1773" height="790" alt="formulaire ajout vente" src="https://github.com/user-attachments/assets/d919166f-6164-42fe-b7e4-11f2596c24e0" />

<img width="1906" height="856" alt="formulaire ajout medicament" src="https://github.com/user-attachments/assets/fa87302b-af5a-470c-b2e4-0ea48fade0ba" />

<img width="1908" height="887" alt="dashboard" src="https://github.com/user-attachments/assets/f6f7534e-b12a-4f37-8b85-e42add1019be" />

# 1. Présentation générale
Titre du projet : PharmaTrack Burkina
Technologie principale : Angular
Contexte : Dans les zones rurales du Burkina Faso, de nombreux dépôts pharmaceutiques ne disposent pas d’outils numériques pour la gestion du stock et des ventes. PharmaTrack a été conçu pour offrir une solution simple, rapide et accessible depuis un navigateur web.
L’application permet de gérer efficacement les médicaments, les ventes quotidiennes, les alertes de rupture et les statistiques, contribuant ainsi à une meilleure organisation et à une réduction des pertes liées à la mauvaise gestion des stocks.

# 2. Objectifs du projet
Mettre en place une application web Angular ergonomique et performante.
Permettre la gestion complète du stock de médicaments (CRUD).
Enregistrer et suivre les ventes quotidiennes.
Afficher un tableau de bord avec les statistiques clés.
Intégrer une authentification simplifiée et une API REST factice pour la simulation des échanges.

# 3. Architecture du système

 Technologies utilisées
Frontend : Angular 18, TypeScript, HTML5, CSS3, Bootstrap 5
Backend simulé : json-server (API REST factice)
Outils : Visual Studio Code, Node.js, GitHub

# 4. Fonctionnalités réalisées
4.1. Gestion des médicaments

Liste complète des médicaments avec tri et recherche.
Ajout, modification et suppression (CRUD complet).
Validation réactive : nom obligatoire, prix > 0, date d’expiration valide.
Alerte automatique lorsque le stock d’un médicament est inférieur à 10 unités.

4.2. Gestion des ventes
Enregistrement d’une vente avec le médicament, la quantité et la date.
Mise à jour automatique du stock après chaque vente.
Calcul du chiffre d’affaires journalier.
Historique des ventes

4.3. Tableau de bord et statistiques

Page d’accueil affichant :
  Médicaments proches de la rupture
  Chiffre d’affaires du jour
  Nombre de ventes journalières
  Graphique (via Chart.js ou Recharts) représentant les ventes par semaine ou par mois.

4.4. Authentification simplifiée

Page de connexion avec rôle Admin / Utilisateur.
Utilisation d’un AuthGuard pour protéger l’accès à l’administration.
Un interceptor HTTP ajoute un token factice à chaque requête sortante.

4.5. Formulaires Angular

Formulaire réactif : ajout/modification de médicament.
Formulaire template-driven : recherche rapide dans la liste.

4.6. API REST factice

Configuration via json-server avec trois ressources principales :

/medicaments → gestion des médicaments
/ventes → enregistrement des ventes
/users → authentification


