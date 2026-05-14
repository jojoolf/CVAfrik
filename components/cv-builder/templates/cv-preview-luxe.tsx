import { Mail, Phone, MapPin, Linkedin, Star } from 'lucide-react'
import type { CVDonnees } from '@/lib/types'

interface CVPreviewLuxeProps {
  data: CVDonnees
  showWatermark?: boolean
}

export function CVPreviewLuxe({ data, showWatermark = false }: CVPreviewLuxeProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="relative min-h-full bg-[#faf8f5] text-gray-800" style={{ fontSize: '10pt', lineHeight: '1.5' }}>
      {/* Watermark (Filigrane) - Version premium au bas pour le plan gratuit */}
      {showWatermark && (
        <div className="absolute bottom-4 left-0 right-0 z-50 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-amber-500/20 shadow-sm overflow-hidden animate-shine">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-amber-600">
              <span className="text-[10px] font-bold text-white">CV</span>
            </div>
            <span className="text-[11px] font-bold text-gray-400">
              Cree avec <span className="text-amber-600 font-bold">CVAfrik</span>
            </span>
          </div>
        </div>
      )}

      {/* Gold accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700" />

      <div className="p-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 mb-4">
            <span className="text-2xl font-serif font-bold text-amber-700">
              {data.informations_personnelles.prenom?.[0]}{data.informations_personnelles.nom?.[0]}
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-wide">
            {data.informations_personnelles.prenom} {data.informations_personnelles.nom}
          </h1>
          <p className="text-sm text-amber-700 uppercase tracking-[0.25em] mt-1 font-medium">
            {data.titre_professionnel}
          </p>
          <div className="w-12 h-px bg-amber-300 mx-auto mt-4" />
        </header>

        {/* Contact */}
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-1 mb-8 text-xs text-gray-500">
          {data.informations_personnelles.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="h-3 w-3 text-amber-500" />
              {data.informations_personnelles.email}
            </span>
          )}
          {data.informations_personnelles.telephone && (
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-amber-500" />
              {data.informations_personnelles.telephone}
            </span>
          )}
          {data.informations_personnelles.adresse && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-amber-500" />
              {data.informations_personnelles.adresse}
            </span>
          )}
          {data.informations_personnelles.linkedin && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="h-3 w-3 text-amber-500" />
              {data.informations_personnelles.linkedin}
            </span>
          )}
        </div>

        {/* Resume */}
        {data.resume && (
          <section className="mb-8 text-center max-w-lg mx-auto">
            <p className="text-gray-600 text-sm italic leading-relaxed">&ldquo;{data.resume}&rdquo;</p>
          </section>
        )}

        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3 space-y-6">
            {/* Experience */}
            {data.experiences.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-amber-700 flex items-center gap-2">
                  <Star className="h-3 w-3" />
                  Parcours
                </h2>
                <div className="space-y-4">
                  {data.experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-4 border-l border-amber-200">
                      <div className="absolute -left-[3px] top-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900">{exp.poste}</h3>
                          <p className="text-gray-600 text-sm">{exp.entreprise}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 ml-2">
                          {formatDate(exp.date_debut)} — {exp.en_cours ? 'Present' : formatDate(exp.date_fin)}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="mt-1 text-gray-700 text-sm">{exp.description}</p>
                      )}
                      {exp.realisations.length > 0 && (
                        <ul className="mt-1 text-sm text-gray-700 space-y-0.5">
                          {exp.realisations.map((r, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">\u2022</span>
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
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-amber-700 flex items-center gap-2">
                  <Star className="h-3 w-3" />
                  Formation
                </h2>
                <div className="space-y-3">
                  {data.formations.map((formation) => (
                    <div key={formation.id} className="relative pl-4 border-l border-amber-200">
                      <div className="absolute -left-[3px] top-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900">{formation.diplome}</h3>
                          <p className="text-gray-600 text-sm">{formation.etablissement}{formation.ville && `, ${formation.ville}`}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 ml-2">
                          {formatDate(formation.date_debut)} — {formation.en_cours ? 'Present' : formatDate(formation.date_fin)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="col-span-2 space-y-6">
            {/* Competences */}
            {data.competences.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-amber-700 flex items-center gap-2">
                  <Star className="h-3 w-3" />
                  Competences
                </h2>
                <div className="space-y-2">
                  {data.competences.map((comp) => (
                    <div key={comp.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">{comp.nom}</span>
                        <span className="text-gray-400">{comp.niveau}</span>
                      </div>
                      <div className="h-1 bg-amber-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
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
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-amber-700 flex items-center gap-2">
                  <Star className="h-3 w-3" />
                  Langues
                </h2>
                <div className="space-y-2">
                  {data.langues.map((langue) => (
                    <div key={langue.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{langue.nom}</span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < (
                                langue.niveau === 'natif' || langue.niveau === 'bilingue' ? 5 :
                                langue.niveau === 'courant' ? 4 :
                                langue.niveau === 'intermediaire' ? 3 : 2
                              ) ? 'bg-amber-400' : 'bg-amber-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Centres d'interet */}
            {(data.centres_interet || []).length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-amber-700 flex items-center gap-2">
                  <Star className="h-3 w-3" />
                  Centres d&apos;interet
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(data.centres_interet || []).map((interet, index) => (
                    <span key={index} className="px-3 py-1 text-[10px] rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {interet}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
