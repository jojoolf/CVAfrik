import { Mail, Phone, MapPin, Linkedin } from 'lucide-react'
import type { CVDonnees } from '@/lib/types'

interface CVPreviewCreatifProps {
  data: CVDonnees
  showWatermark?: boolean
}

export function CVPreviewCreatif({ data, showWatermark = false }: CVPreviewCreatifProps) {
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

      {/* Header with colored band */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {data.informations_personnelles.prenom} {data.informations_personnelles.nom}
            </h1>
            <p className="text-sm mt-1 text-purple-100 uppercase tracking-wider font-medium">
              {data.titre_professionnel}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-purple-100">
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
          </div>
        </div>
        {data.informations_personnelles.linkedin && (
          <div className="mt-2 flex items-center gap-1 text-xs text-purple-100">
            <Linkedin className="h-3 w-3" />
            <span>{data.informations_personnelles.linkedin}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Resume */}
        {data.resume && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 text-purple-600 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-600 rounded-full inline-block" />
              Profil
            </h2>
            <p className="text-gray-700">{data.resume}</p>
          </section>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-purple-600 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-600 rounded-full inline-block" />
              Experience
            </h2>
            <div className="space-y-4">
              {data.experiences.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-purple-200">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-purple-600" />
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.poste}</h3>
                      <p className="text-gray-600 text-sm italic">{exp.entreprise}{exp.ville && `, ${exp.ville}`}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap shrink-0 ml-2">
                      {formatDate(exp.date_debut)} - {exp.en_cours ? 'Present' : formatDate(exp.date_fin)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-1 text-gray-700 text-sm">{exp.description}</p>
                  )}
                  {exp.realisations.length > 0 && (
                    <ul className="mt-1 list-disc list-inside text-sm text-gray-700 space-y-0.5">
                      {exp.realisations.map((r, i) => (
                        <li key={i}>{r}</li>
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
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-purple-600 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-600 rounded-full inline-block" />
              Formation
            </h2>
            <div className="space-y-3">
              {data.formations.map((formation) => (
                <div key={formation.id} className="relative pl-6 border-l-2 border-purple-200">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-purple-600" />
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{formation.diplome}</h3>
                      <p className="text-gray-600 text-sm">{formation.etablissement}{formation.ville && `, ${formation.ville}`}</p>
                      {formation.description && <p className="text-xs text-gray-500 mt-0.5">{formation.description}</p>}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap shrink-0 ml-2">
                      {formatDate(formation.date_debut)} - {formation.en_cours ? 'Present' : formatDate(formation.date_fin)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Competences */}
          {data.competences.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-purple-600 flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-600 rounded-full inline-block" />
                Competences
              </h2>
              <div className="space-y-2">
                {data.competences.map((comp) => (
                  <div key={comp.id} className="flex items-center gap-2">
                    <span className="text-sm w-24 font-medium">{comp.nom}</span>
                    <div className="flex-1 h-2 bg-purple-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{
                          width: comp.niveau === 'expert' ? '100%' : comp.niveau === 'avance' ? '80%' : comp.niveau === 'intermediaire' ? '60%' : '40%'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Langues */}
          {data.langues.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-purple-600 flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-600 rounded-full inline-block" />
                Langues
              </h2>
              <div className="space-y-2">
                {data.langues.map((langue) => (
                  <div key={langue.id} className="flex items-center gap-2">
                    <span className="text-sm w-24 font-medium">{langue.nom}</span>
                    <div className="flex-1 h-2 bg-purple-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-pink-400"
                        style={{
                          width: langue.niveau === 'natif' || langue.niveau === 'bilingue' ? '100%' : langue.niveau === 'courant' ? '80%' : langue.niveau === 'intermediaire' ? '60%' : '40%'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Centres d'interet */}
        {(data.centres_interet || []).length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 text-purple-600 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-600 rounded-full inline-block" />
              Centres d&apos;interet
            </h2>
            <div className="flex flex-wrap gap-2">
              {(data.centres_interet || []).map((interet, index) => (
                <span key={index} className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
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
