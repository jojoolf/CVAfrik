export const LETTER_TYPES = [
  {
    id: 'emploi',
    label: 'Candidature à un emploi',
    description: 'Pour répondre à une offre de poste ou proposer sa candidature à une entreprise.',
    recipientLabel: 'Entreprise ou organisation',
    targetLabel: 'Poste visé',
    promptInstruction: "Réponds comme à une offre d'emploi : démontre l'adéquation entre les compétences du candidat, le poste et les besoins de l'organisation.",
  },
  {
    id: 'spontanee',
    label: 'Candidature spontanée',
    description: 'Pour proposer ses services même lorsqu’aucune offre précise n’est publiée.',
    recipientLabel: 'Entreprise ou organisation',
    targetLabel: 'Fonction ou domaine recherché',
    promptInstruction: "Rédige une candidature spontanée : explique clairement la valeur que le candidat peut apporter sans prétendre qu'une offre existe.",
  },
  {
    id: 'stage',
    label: 'Demande de stage',
    description: 'Pour obtenir un stage d’observation, de fin d’études ou professionnel.',
    recipientLabel: 'Entreprise ou structure d’accueil',
    targetLabel: 'Stage recherché',
    promptInstruction: "Rédige une demande de stage : précise l'objectif d'apprentissage, la contribution possible et le lien avec le parcours de formation.",
  },
  {
    id: 'alternance',
    label: 'Alternance',
    description: 'Pour associer formation et expérience en entreprise.',
    recipientLabel: 'Entreprise ou organisation',
    targetLabel: 'Poste ou mission en alternance',
    promptInstruction: "Rédige une demande d'alternance : valorise le rythme formation-entreprise, les compétences mobilisables et la motivation à apprendre sur le terrain.",
  },
  {
    id: 'bourse',
    label: 'Bourse d’études',
    description: 'Pour une bourse académique, de mobilité ou de développement professionnel.',
    recipientLabel: 'Organisme attribuant la bourse',
    targetLabel: 'Programme ou bourse visée',
    promptInstruction: "Rédige une lettre de demande de bourse : mets en avant le projet académique ou professionnel, l'impact attendu et le sérieux du parcours.",
  },
  {
    id: 'programme_incubateur',
    label: 'Programme ou incubateur',
    description: 'Pour un programme entrepreneurial, un accélérateur, une ONG ou une initiative de leadership.',
    recipientLabel: 'Organisation ou programme',
    targetLabel: 'Programme visé',
    promptInstruction: "Rédige une candidature à un programme ou incubateur : explique l'ambition, la cohérence du projet et la contribution attendue à l'écosystème.",
  },
] as const

export type LetterType = (typeof LETTER_TYPES)[number]['id']

export function getLetterType(type: string | undefined) {
  return LETTER_TYPES.find((item) => item.id === type) || LETTER_TYPES[0]
}
