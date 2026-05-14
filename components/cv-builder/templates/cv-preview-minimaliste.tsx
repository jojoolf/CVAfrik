import { Mail, Phone, MapPin, Linkedin } from 'lucide-react'
import type { CVDonnees } from '@/lib/types'

interface CVPreviewMinimalisteProps {
  data: CVDonnees
  showWatermark?: boolean
}

export function CVPreviewMinimaliste({ data, showWatermark = false }: CVPreviewMinimalisteProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="relative min-h-full bg-white text-gray-800" style={{ fontSize: '10pt', lineHeight: '1.6' }}>
      {/* Watermark (Filigrane) - Version premium au bas pour le plan gratuit */}
      {showWatermark && (
        <div className="absolute bottom-4 left-0 right-0 z-50 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-gray-500/20 shadow-sm overflow-hidden animate-shine">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-gray-600">
              <span className="text-[10px] font-bold text-white">CV</span>
            </div>
            <span className="text-[11px] font-bold text-gray-400">
              Cree avec <span className="text-gray-600 font-bold">CVAfrik</span>
            </span>
          </div>
        </div>
      )}

      <div className="p-10 max-w-[600px] mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-light text-gray-900">
            {data.informations_personnelles.prenom} {data.informations_personnelles.nom}
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">
            {data.titre_professionnel}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
            {data.informations_personnelles.email && (
              <span>{data.informations_personnelles.email}</span>
            )}
            {data.informations_personnelles.telephone && (
              <span>{data.informations_personnelles.telephone}</span>
            )}
            {data.informations_personnelles.adresse && (
              <span>{data.informations_personnelles.adresse}</span>
            )}
            {data.informations_personnelles.linkedin && (
              <span>{data.informations_personnelles.linkedin}</span>
            )}
          </div>
        </header>

        {/* Resume */}
        {data.resume && (
          <section className="mb-7">
            <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] mb-2 text-gray-300">
              Profil
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{data.resume}</p>
          </section>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && (
          <section className="mb-7">
            <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] mb-4 text-gray-300">
              Experience
            </h2>
            <div className="space-y-5">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-gray-800 text-sm">{exp.poste}</h3>
                    <span className="text-[10px] text-gray-300 whitespace-nowrap ml-2">
                      {formatDate(exp.date_debut)} – {exp.en_cours ? 'Present' : formatDate(exp.date_fin)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {exp.entreprise}{exp.ville && `, ${exp.ville}`}
                  </p>
                  {exp.description && (
                    <p className="text-xs text-gray-500 mt-1">{exp.description}</p>
                  )}
                  {exp.realisations.length > 0 && (
                    <ul className="mt-1 text-xs text-gray-500 space-y-0.5">
                      {exp.realisations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-gray-300 mt-1.5">\u2022</span>
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
          <section className="mb-7">
            <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] mb-4 text-gray-300">
              Formation
            </h2>
            <div className="space-y-3">
              {data.formations.map((formation) => (
                <div key={formation.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-gray-800 text-sm">{formation.diplome}</h3>
                    <span className="text-[10px] text-gray-300 whitespace-nowrap ml-2">
                      {formatDate(formation.date_debut)} – {formation.en_cours ? 'Present' : formatDate(formation.date_fin)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formation.etablissement}{formation.ville && `, ${formation.ville}`}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {/* Competences */}
          {data.competences.length > 0 && (
            <section>
              <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] mb-3 text-gray-300">
                Competences
              </h2>
              <div className="space-y-1.5">
                {data.competences.map((comp) => (
                  <div key={comp.id} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-20">{comp.nom}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i < (
                              comp.niveau === 'expert' ? 5 :
                              comp.niveau === 'avance' ? 4 :
                              comp.niveau === 'intermediaire' ? 3 : 2
                            ) ? 'bg-gray-500' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Langues */}
          {data.langues.length > 0 && (
            <section>
              <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] mb-3 text-gray-300">
                Langues
              </h2>
              <div className="space-y-1">
                {data.langues.map((langue) => (
                  <div key={langue.id} className="flex justify-between text-xs">
                    <span className="text-gray-600">{langue.nom}</span>
                    <span className="text-gray-400">{langue.niveau}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Centres d'interet */}
        {(data.centres_interet || []).length > 0 && (
          <section className="mt-7">
            <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] mb-2 text-gray-300">
              Centres d&apos;interet
            </h2>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {(data.centres_interet || []).map((interet, index) => (
                <span key={index} className="text-xs text-gray-500">
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
