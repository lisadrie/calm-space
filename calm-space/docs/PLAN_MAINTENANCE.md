# Plan de maintenance et de gestion des tickets — CalmSpace

> Document technique — Bloc 3 « Déployer et sécuriser les applications informatiques »
> Outil de ticketing retenu : **Jira** (Atlassian)

---

## 1. Objectif

Assurer la **maintenance corrective** (correction des incidents) et **évolutive** (nouvelles
demandes) de CalmSpace, en organisant la communication entre le **client** (le Ministère) et le
**prestataire** (l'équipe de développement) à travers un outil de **ticketing** : Jira.

Chaque incident ou demande d'évolution donne lieu à un **ticket** suivi de sa création jusqu'à
sa résolution et sa validation.

---

## 2. Choix de l'outil : Jira

| Critère | Apport de Jira |
|--------|----------------|
| Standard du marché | Outil de référence en entreprise, compétence valorisable |
| Gestion fine | Types de tickets, priorités, workflow personnalisable, SLA |
| Suivi (pilotage) | Tableaux de bord, filtres, rapports d'avancement |
| Collaboration | Attribution, commentaires, historique, notifications |
| Coût | **Gratuit** jusqu'à 10 utilisateurs |

---

## 3. Types de tickets

| Type | Usage | Exemple |
|------|-------|---------|
| 🐞 **Incident** | Dysfonctionnement signalé (maintenance corrective) | « Impossible de se connecter » |
| ✨ **Évolution** | Nouvelle fonctionnalité / amélioration (maintenance évolutive) | « Ajouter l'export du journal d'émotions » |
| 📄 **Tâche** | Travail interne (technique, documentation) | « Mettre à jour les dépendances » |

---

## 4. Classification de la sévérité et délais (SLA)

Les niveaux et délais reprennent **exactement** les exigences du cahier des charges CESIZen.

### 4.1 Définition des sévérités

| Sévérité | Définition |
|----------|-----------|
| 🔴 **Bloquant** | Interruption non planifiée d'un service, **sans solution de contournement** |
| 🟠 **Majeur** | Service inopérant par intermittence ou via une solution de contournement |
| 🟡 **Mineur** | Simple altération de la qualité, le service reste opérationnel |

### 4.2 Délais contractuels (SLA)

| Priorité | Prise en compte & diagnostic | Délai de correction |
|----------|------------------------------|---------------------|
| 🔴 Bloquant — critique | **1 h** ouvrée | **3 h** ouvrées |
| 🔴 Bloquant — fort | **2 h** ouvrées | **6 h** ouvrées |
| 🟠 Majeur | **7 h** ouvrées | **16 h** ouvrées |
| 🟡 Mineur (par lots) | **1 jour** ouvré | **40 h** ouvrées |

Dans Jira, ces niveaux sont configurés via le champ **Priorité** (Bloquant-critique,
Bloquant-fort, Majeur, Mineur).

---

## 5. Workflow d'un ticket (cycle de vie)

```
   [ À FAIRE ] ──► [ EN COURS ] ──► [ EN RECETTE ] ──► [ TERMINÉ ]
       │               │                 │                 │
   Ticket créé     Prise en          Correctif        Validé par
   par le client   charge par        déployé, à       le client
   ou détecté      le prestataire    tester           (clôture)
```

1. **À faire** — le ticket est créé (par le client via Jira, ou par supervision) et qualifié
   (type + sévérité).
2. **En cours** — le prestataire prend en charge, diagnostique et développe le correctif/l'évolution.
3. **En recette** — la correction est déployée sur l'environnement de test pour validation.
4. **Terminé** — le client valide la résolution ; le ticket est clôturé.

En cas de refus en recette, le ticket repasse **En cours** (boucle de correction).

---

## 6. Méthodologie

### 6.1 Maintenance corrective

1. Signalement de l'incident via un **ticket Jira** (par le client ou détecté par supervision).
2. Qualification : type = *Incident*, priorité selon la sévérité (§4).
3. Diagnostic dans les délais SLA, puis correction ou solution de contournement.
4. Test de **non-régression** avant remise en service (voir la CI/CD).
5. Validation par le client et clôture.

### 6.2 Maintenance évolutive

Chaque demande d'évolution fait l'objet d'un ticket, puis d'une **analyse** avec une proposition :

- **Documentation** fonctionnelle et technique de l'évolution ;
- **Délai** de mise en œuvre estimé ;
- **Coût** associé.

Après accord du client, l'évolution est planifiée, développée, testée puis livrée.

### 6.3 Veille technologique (pérennité)

Pour garantir la pérennité de l'application, une **veille** est assurée :

- **Sécurité** : suivi des vulnérabilités (`npm audit`, alertes GitHub Dependabot).
- **Dépendances** : mises à jour régulières des bibliothèques (React, Express, PostgreSQL…).
- **Sources de veille** : bulletins de l'ANSSI/CERT-FR, blogs officiels des technologies, newsletters.
- **Cadence** : revue mensuelle, création de tickets *Tâche* pour les mises à jour à planifier.

---

## 7. Pilotage (tableaux de bord)

Le suivi de la maintenance est assuré par un **tableau de bord Jira** (Dashboard) présentant :

- le nombre de tickets **ouverts / en cours / résolus** ;
- la **répartition par sévérité** ;
- le **respect des délais (SLA)** ;
- les tickets **en retard** à traiter en priorité.

Ces indicateurs permettent au Ministère de suivre la qualité de service dans le temps.

---

## 8. Guide de configuration Jira (pour la démonstration)

> À réaliser une fois pour la soutenance — pensez à faire des **captures d'écran**.

1. **Créer un compte gratuit** sur [https://www.atlassian.com/software/jira](https://www.atlassian.com/software/jira)
   → « Get it free ».
2. **Créer un projet** de type **Kanban** (ou « Suivi des bugs »), nommé par ex. `CalmSpace — Support`.
3. **Configurer les colonnes** du tableau pour refléter le workflow : *À faire → En cours →
   En recette → Terminé*.
4. **Configurer les priorités** pour correspondre aux sévérités : Bloquant-critique,
   Bloquant-fort, Majeur, Mineur.
5. **Créer 3–4 tickets d'exemple** représentatifs :
   - 🐞 Incident bloquant : « Erreur 500 à la connexion » (priorité Bloquant-critique) ;
   - 🐞 Incident mineur : « Faute d'orthographe sur la page d'accueil » (priorité Mineur) ;
   - ✨ Évolution : « Export PDF du journal d'émotions » ;
   - 📄 Tâche : « Mise à jour mensuelle des dépendances (veille) ».
6. **Créer un Dashboard** avec un ou deux gadgets (ex. « Répartition par statut »,
   « Tickets par priorité ») pour illustrer le pilotage.
7. Faire glisser un ticket d'une colonne à l'autre pendant la démo pour montrer le workflow.

---

*Document réalisé dans le cadre de l'évaluation du Bloc 3 — CDA CESIZen.*
