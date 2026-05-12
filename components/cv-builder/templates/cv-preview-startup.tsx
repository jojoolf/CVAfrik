import { Mail, Phone, MapPin, Linkedin, Zap } from 'lucide-react'
import type { CVDonnees } from '@/lib/types'

interface CVPreviewStartupProps {
  data: CVDonnees
  showWatermark?: boolean
}

export function CVPreviewStartup({ data, showWatermark = false }: CVPreviewStartupProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="relative min-h-full bg-white text-gray-800" style={{ fontSize: '10pt', lineHeight: '1.4' }}>
      {showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="rotate-[-30deg] text-6xl font-bold text-gray-500">CVAfrik</div>
        </div>
      )}

      {/* Orange accent header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-orange-200" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-orange-200 font-medium">CV Startup</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {data.informations_personnelles.prenom} {data.informations_personnelles.nom}
            </h1>
            <p className="text-sm text-orange-100 mt-0.5">
              {data.titre_professionnel}
            </p>
          </div>
        </div>
      </div>

      {/* Contact bar */}
      <div className="bg-orange-50 px-5 py-2 flex flex-wrap gap-4 text-xs text-orange-800">
        {data.informations_personnelles.email && (
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3" />{data.informations_personnelles.email}
          </span>
        )}
        {data.informations_personnelles.telephone && (
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3" />{data.informations_personnelles.telephone}
          </span>
        )}
        {data.informations_personnelles.adresse && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />{data.informations_personnelles.adresse}
          </span>
        )}
        {data.informations_personnelles.linkedin && (
          <span className="flex items-center gap-1">
            <Linkedin className="h-3 w-3" />{data.informations_personnelles.linkedin}
          </span>
        )}
      </div>

      <div className="p-5">
        {/* Resume */}
        {data.resume && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-orange-500">
              Qui suis-je
            </h2>
            <p className="text-gray-700">{data.resume}</p>
          </section>
        )}

        <div className="grid grid-cols-3 gap-4 mb-5">
          {/* Competences */}
          {data.competences.length > 0 && (
            <section className="col-span-2">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-orange-500">
                Competences
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.competences.map((comp) => (
                  <span
                    key={comp.id}
                    className="px-2 py-1 text-[10px] rounded-md bg-orange-50 text-orange-700 border border-orange-200 font-medium"
                  >
                    {comp.nom}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Langues & infos */}
          <section>
            {data.langues.length > 0 && (
              <div className="mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-orange-500">
                  Langues
                </h2>
                <div className="space-y-1">
                  {data.langues.map((langue) => (
                    <div key={langue.id} className="flex justify-between text-xs">
                      <span className="font-medium">{langue.nom}</span>
                      <span className="text-gray-400">{langue.niveau}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Experience */}
        {data.experiences.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-orange-500">
              Experience
            </h2>
            <div className="space-y-4">
              {data.experiences.map((exp) => (
                <div key={exp.id} className="bg-orange-50/50 rounded-lg p-3 border border-orange-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.poste}</h3>
                      <p className="text-gray-600 text-sm">{exp.entreprise}{exp.ville && `, ${exp.ville}`}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap shrink-0 ml-2">
                      {formatDate(exp.date_debut)} - {exp.en_cours ? 'Present' : formatDate(exp.date_fin)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-1 text-gray-700 text-sm">{exp.description}</p>
                  )}
                  {exp.realisations.length > 0 && (
                    <ul className="mt-1 text-sm text-gray-700 space-y-0.5">
                      {exp.realisations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-orange-400 mt-1 shrink-0">\u2192</span>
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

        {/* Formation */}
        {data.formations.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-orange-500">
              Formation
            </h2>
            <div className="space-y-3">
              {data.formations.map((formation) => (
                <div key={formation.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{formation.diplome}</h3>
                    <p className="text-gray-600 text-sm">{formation.etablissement}{formation.ville && `, ${formation.ville}`}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap shrink-0 ml-2">
                    {formatDate(formation.date_debut)} - {formation.en_cours ? 'Present' : formatDate(formation.date_fin)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Centres d'interet */}
        {(data.centres_interet || []).length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-orange-500">
              Centres d&apos;interet
            </h2>
            <div className="flex flex-wrap gap-2">
              {(data.centres_interet || []).map((interet, index) => (
                <span key={index} className="px-3 py-1 text-xs rounded-full bg-orange-500 text-white">
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
