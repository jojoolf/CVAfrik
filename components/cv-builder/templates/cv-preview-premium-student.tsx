import { Mail, Phone, MapPin, Linkedin, GraduationCap } from 'lucide-react'
import type { CVDonnees } from '@/lib/types'

interface CVPreviewPremiumStudentProps {
  data: CVDonnees
  showWatermark?: boolean
}

export function CVPreviewPremiumStudent({ data, showWatermark = false }: CVPreviewPremiumStudentProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="relative min-h-full bg-white text-gray-800" style={{ fontSize: '10pt', lineHeight: '1.4' }}>
      {showWatermark && (
        <div className="absolute bottom-4 left-0 right-0 z-50 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-primary/20 shadow-sm">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary">
              <span className="text-[10px] font-bold text-white">CV</span>
            </div>
            <span className="text-[11px] font-bold text-gray-400">
              Créé avec <span className="text-primary font-bold">CVAfrik</span>
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header épuré */}
        <div className="border-b-2 border-indigo-500 pb-5 mb-5">
          <div className="flex items-center gap-4">
            {data.informations_personnelles.photo && (
              <img
                src={data.informations_personnelles.photo}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {data.informations_personnelles.prenom} {data.informations_personnelles.nom}
              </h1>
              <p className="text-indigo-600 text-sm font-semibold flex items-center gap-1.5 mt-0.5">
                <GraduationCap className="h-4 w-4" />
                {data.titre_professionnel}
              </p>
            </div>
          </div>
          {/* Contact */}
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
            {data.informations_personnelles.email && (
              <span className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-full">
                <Mail className="h-3 w-3 text-indigo-400" /> {data.informations_personnelles.email}
              </span>
            )}
            {data.informations_personnelles.telephone && (
              <span className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-full">
                <Phone className="h-3 w-3 text-indigo-400" /> {data.informations_personnelles.telephone}
              </span>
            )}
            {data.informations_personnelles.adresse && (
              <span className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-full">
                <MapPin className="h-3 w-3 text-indigo-400" /> {data.informations_personnelles.adresse}
              </span>
            )}
            {data.informations_personnelles.linkedin && (
              <span className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-full">
                <Linkedin className="h-3 w-3 text-indigo-400" /> {data.informations_personnelles.linkedin}
              </span>
            )}
          </div>
        </div>

        {/* Résumé */}
        {data.resume && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600 mb-2 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-indigo-400" />
              Profil
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{data.resume}</p>
          </section>
        )}

        {/* FORMATION EN PRIORITÉ pour les étudiants */}
        {data.formations.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600 mb-3 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-indigo-400" />
              Formation
            </h2>
            <div className="space-y-3">
              {data.formations.map((formation) => (
                <div key={formation.id} className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                        {formation.diplome}
                      </h3>
                      <p className="text-indigo-600 text-xs font-medium mt-0.5">{formation.etablissement}{formation.ville && `, ${formation.ville}`}</p>
                      {formation.description && (
                        <p className="text-gray-500 text-xs mt-1">{formation.description}</p>
                      )}
                    </div>
                    <span className="text-[9px] text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ml-2">
                      {formatDate(formation.date_debut)} - {formation.en_cours ? 'Présent' : formatDate(formation.date_fin)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Expériences (stages, etc.) */}
        {data.experiences.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600 mb-3 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-indigo-400" />
              Expérience & Stages
            </h2>
            <div className="space-y-3">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{exp.poste}</h3>
                      <p className="text-indigo-500 text-xs font-medium">{exp.entreprise}{exp.ville && ` · ${exp.ville}`}</p>
                    </div>
                    <span className="text-[9px] text-gray-500 font-medium whitespace-nowrap ml-2">
                      {formatDate(exp.date_debut)} - {exp.en_cours ? 'Présent' : formatDate(exp.date_fin)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-1 text-gray-600 text-xs">{exp.description}</p>
                  )}
                  {exp.realisations.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.realisations.map((r, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                          <span className="text-indigo-400 mt-0.5">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Compétences + Langues en grille */}
        <div className="grid grid-cols-2 gap-5">
          {data.competences.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600 mb-2 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-indigo-400" />
                Compétences
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.competences.map((comp) => (
                  <span key={comp.id} className="text-[9px] px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                    {comp.nom}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data.langues.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600 mb-2 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-indigo-400" />
                Langues
              </h2>
              <div className="space-y-1">
                {data.langues.map((langue) => (
                  <div key={langue.id} className="flex justify-between text-xs">
                    <span className="text-gray-700">{langue.nom}</span>
                    <span className="text-indigo-500 capitalize text-[9px] font-semibold">{langue.niveau}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Centres d'intérêt */}
        {(data.centres_interet || []).length > 0 && (
          <section className="mt-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600 mb-2 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-indigo-400" />
              Centres d&apos;intérêt
            </h2>
            <div className="flex flex-wrap gap-1">
              {(data.centres_interet || []).map((interet, index) => (
                <span key={index} className="px-2 py-0.5 text-[9px] rounded-full bg-gray-50 text-gray-600 border border-gray-100">
                  {interet}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
