import { Mail, Phone, MapPin, Linkedin, Github, Code2 } from 'lucide-react'
import type { CVDonnees } from '@/lib/types'

interface CVPreviewTechProps {
  data: CVDonnees
  showWatermark?: boolean
}

export function CVPreviewTech({ data, showWatermark = false }: CVPreviewTechProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="relative min-h-full bg-white text-gray-800" style={{ fontSize: '10pt', lineHeight: '1.4' }}>
      {/* Watermark (Filigrane) - Version premium au bas pour le plan gratuit */}
      {showWatermark && (
        <div className="absolute bottom-4 left-0 right-0 z-50 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-cyan-500/20 shadow-sm overflow-hidden animate-shine">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-cyan-600">
              <span className="text-[10px] font-bold text-white">CV</span>
            </div>
            <span className="text-[11px] font-bold text-gray-400">
              Cree avec <span className="text-cyan-600 font-bold">CVAfrik</span>
            </span>
          </div>
        </div>
      )}

      {/* Terminal-style header */}
      <div className="bg-gray-950 p-5 text-white font-mono">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-gray-500 text-xs ml-2">cv-terminal.sh</span>
        </div>
        <div className="text-sm space-y-1">
          <p><span className="text-green-400">$</span> <span className="text-cyan-400">cat</span> profile.json</p>
          <p className="text-white text-base font-bold">
            {data.informations_personnelles.prenom} {data.informations_personnelles.nom}
          </p>
          <p className="text-gray-400">{data.titre_professionnel}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
            {data.informations_personnelles.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3 text-cyan-400" />
                {data.informations_personnelles.email}
              </span>
            )}
            {data.informations_personnelles.telephone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-cyan-400" />
                {data.informations_personnelles.telephone}
              </span>
            )}
            {data.informations_personnelles.adresse && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-cyan-400" />
                {data.informations_personnelles.adresse}
              </span>
            )}
            {data.informations_personnelles.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="h-3 w-3 text-cyan-400" />
                {data.informations_personnelles.linkedin}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 font-mono text-sm">
        {/* Resume */}
        {data.resume && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-cyan-600 flex items-center gap-2">
              <Code2 className="h-3 w-3" />
              <span>/** profil **/</span>
            </h2>
            <p className="text-gray-700">{data.resume}</p>
          </section>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-cyan-600 flex items-center gap-2">
              <Code2 className="h-3 w-3" />
              <span>/** experience **/</span>
            </h2>
            <div className="space-y-4">
              {data.experiences.map((exp) => (
                <div key={exp.id} className="border-l-2 border-emerald-500 pl-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.poste}</h3>
                      <p className="text-gray-600 text-xs">{exp.entreprise}{exp.ville && ` \u2022 ${exp.ville}`}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap shrink-0 ml-2">
                      {formatDate(exp.date_debut)} - {exp.en_cours ? 'Present' : formatDate(exp.date_fin)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-1 text-gray-700 text-xs">{exp.description}</p>
                  )}
                  {exp.realisations.length > 0 && (
                    <ul className="mt-1 list-disc list-inside text-xs text-gray-700 space-y-0.5">
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
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-cyan-600 flex items-center gap-2">
              <Code2 className="h-3 w-3" />
              <span>/** education **/</span>
            </h2>
            <div className="space-y-3">
              {data.formations.map((formation) => (
                <div key={formation.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{formation.diplome}</h3>
                    <p className="text-gray-600 text-xs">{formation.etablissement}{formation.ville && `, ${formation.ville}`}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap shrink-0 ml-2">
                    {formatDate(formation.date_debut)} - {formation.en_cours ? 'Present' : formatDate(formation.date_fin)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Competences */}
          {data.competences.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-cyan-600 flex items-center gap-2">
                <Code2 className="h-3 w-3" />
                <span>/** skills **/</span>
              </h2>
              <div className="space-y-2">
                {data.competences.map((comp) => (
                  <div key={comp.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{comp.nom}</span>
                      <span className="text-gray-400">{comp.niveau}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
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
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-cyan-600 flex items-center gap-2">
                <Code2 className="h-3 w-3" />
                <span>/** languages **/</span>
              </h2>
              <div className="space-y-2">
                {data.langues.map((langue) => (
                  <div key={langue.id} className="flex items-center gap-2">
                    <span className="text-xs font-medium w-20">{langue.nom}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < (
                              langue.niveau === 'natif' || langue.niveau === 'bilingue' ? 5 :
                              langue.niveau === 'courant' ? 4 :
                              langue.niveau === 'intermediaire' ? 3 : 2
                            ) ? 'bg-emerald-500' : 'bg-gray-200'
                          }`}
                        />
                      ))}
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
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-cyan-600 flex items-center gap-2">
              <Code2 className="h-3 w-3" />
              <span>/** interests **/</span>
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {(data.centres_interet || []).map((interet, index) => (
                <span key={index} className="px-2 py-0.5 text-[10px] rounded bg-gray-100 text-gray-700 font-mono">
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
