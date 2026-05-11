export interface StressEvent {
  id: string;
  event_text: string;
  points: number;
  category: string;
}

export const STRESS_EVENTS: StressEvent[] = [
  // Famille
  { id: '1',  event_text: 'Décès du conjoint(e)',                              points: 100, category: 'Famille' },
  { id: '2',  event_text: 'Divorce',                                            points: 73,  category: 'Famille' },
  { id: '3',  event_text: 'Séparation conjugale',                               points: 65,  category: 'Famille' },
  { id: '4',  event_text: "Décès d'un membre proche de la famille",             points: 63,  category: 'Famille' },
  { id: '5',  event_text: 'Mariage',                                            points: 50,  category: 'Famille' },
  { id: '6',  event_text: 'Réconciliation avec le conjoint(e)',                 points: 45,  category: 'Famille' },
  { id: '7',  event_text: "Arrivée d'un nouveau membre dans la famille",        points: 39,  category: 'Famille' },
  { id: '8',  event_text: "Changement dans la santé d'un membre de la famille", points: 44,  category: 'Famille' },
  { id: '9',  event_text: 'Grossesse',                                          points: 40,  category: 'Famille' },
  { id: '10', event_text: 'Difficultés sexuelles',                              points: 39,  category: 'Famille' },
  // Travail
  { id: '11', event_text: 'Licenciement',                                       points: 47,  category: 'Travail' },
  { id: '12', event_text: 'Retraite',                                           points: 45,  category: 'Travail' },
  { id: '13', event_text: 'Changement de situation professionnelle',            points: 39,  category: 'Travail' },
  { id: '14', event_text: 'Modification des responsabilités au travail',        points: 29,  category: 'Travail' },
  { id: '15', event_text: 'Problèmes avec le supérieur hiérarchique',           points: 23,  category: 'Travail' },
  { id: '16', event_text: 'Changement des conditions de travail',               points: 20,  category: 'Travail' },
  // Santé
  { id: '17', event_text: 'Blessure ou maladie personnelle',                    points: 53,  category: 'Santé' },
  { id: '18', event_text: "Début ou arrêt de l'emploi du conjoint(e)",          points: 26,  category: 'Santé' },
  // Finances
  { id: '19', event_text: 'Importante dégradation financière',                  points: 38,  category: 'Finances' },
  { id: '20', event_text: "Remboursement d'une dette ou d'un prêt",             points: 30,  category: 'Finances' },
  { id: '21', event_text: "Emprunt de moins de 10 000€",                        points: 17,  category: 'Finances' },
  { id: '22', event_text: "Saisie d'hypothèque ou de prêt",                     points: 30,  category: 'Finances' },
  // Social
  { id: '23', event_text: "Décès d'un ami proche",                              points: 37,  category: 'Social' },
  { id: '24', event_text: 'Changement de relations amicales',                   points: 26,  category: 'Social' },
  // Logement
  { id: '25', event_text: 'Déménagement',                                       points: 20,  category: 'Logement' },
  { id: '26', event_text: 'Changement dans les conditions de logement',         points: 25,  category: 'Logement' },
  // Autre
  { id: '27', event_text: 'Infraction mineure à la loi',                        points: 11,  category: 'Autre' },
  { id: '28', event_text: 'Emprisonnement',                                     points: 63,  category: 'Autre' },
  { id: '29', event_text: 'Vacances',                                           points: 13,  category: 'Autre' },
  { id: '30', event_text: 'Fêtes de Noël / fin d\'année',                       points: 12,  category: 'Autre' },
];
