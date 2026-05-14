import { Mail, Phone, MapPin, Linkedin } from 'lucide-react'
import type { CVDonnees } from '@/lib/types'

interface CVPreviewClassiqueProps {
  data: CVDonnees
  showWatermark?: boolean
}

export function CVPreviewClassique({ data, showWatermark = false }: CVPreviewClassiqueProps) {
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
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-primary/20 shadow-sm overflow-hidden animate-shine">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary">
              <span className="text-[10px] font-bold text-white">CV</span>
            </div>
            <span className="text-[11px] font-bold text-gray-400">
              Cree avec <span className="text-primary font-bold">CVAfrik</span>
            </span>
          </div>
        </div>
      )}

      <div className="flex min-h-full">
        {/* Left sidebar */}
        <div className="w-1/3 bg-gray-900 p-6 text-white">
          <div className="text-center mb-6">
            {data.informations_personnelles.photo && (
              <img 
                src={data.informations_personnelles.photo} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-gray-700"
              />
            )}
            <h1 className="text-xl font-bold">
              {data.informations_personnelles.prenom} {data.informations_personnelles.nom}
            </h1>
            <p className="text-sm mt-1 text-gray-300 uppercase tracking-wider">
              {data.titre_professionnel}
            </p>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-400">Contact</h2>
            <div className="space-y-2 text-sm">
              {data.informations_personnelles.email && (
                <p className="flex items-center gap-2 text-gray-300">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="break-all">{data.informations_personnelles.email}</span>
                </p>
              )}
              {data.informations_personnelles.telephone && (
                <p className="flex items-center gap-2 text-gray-300">
                  <Phone className="h-3 w-3 shrink-0" />
                  <span>{data.informations_personnelles.telephone}</span>
                </p>
              )}
              {data.informations_personnelles.adresse && (
                <p className="flex items-center gap-2 text-gray-300">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>{data.informations_personnelles.adresse}</span>
                </p>
              )}
              {data.informations_personnelles.linkedin && (
                <p className="flex items-center gap-2 text-gray-300">
                  <Linkedin className="h-3 w-3 shrink-0" />
                  <span className="break-all">{data.informations_personnelles.linkedin}</span>
                </p>
              )}
            </div>
          </div>

          {/* Competences */}
          {data.competences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-400">Competences</h2>
              <div className="space-y-2">
                {data.competences.map((comp) => (
                  <div key={comp.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-200">{comp.nom}</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{
                          width: comp.niveau === 'expert' ? '100%' : comp.niveau === 'avance' ? '80%' : comp.niveau === 'intermediaire' ? '60%' : '40%'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {data.langues.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-400">Langues</h2>
              <div className="space-y-1">
                {data.langues.map((langue) => (
                  <div key={langue.id} className="flex justify-between text-sm">
                    <span className="text-gray-200">{langue.nom}</span>
                    <span className="text-gray-400 capitalize">{langue.niveau}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Centres d'interet */}
          {(data.centres_interet || []).length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-400">Centres d&apos;interet</h2>
              <div className="flex flex-wrap gap-1.5">
                {(data.centres_interet || []).map((interet, index) => (
                  <span key={index} className="px-2 py-0.5 text-xs rounded bg-gray-800 text-gray-300">
                    {interet}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right content */}
        <div className="w-2/3 p-6">
          {/* Resume */}
          {data.resume && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2 text-gray-400">Profil</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{data.resume}</p>
            </section>
          )}

          {/* Experience */}
          {data.experiences.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-400 border-b border-gray-200 pb-1">
                Experience professionnelle
              </h2>
              <div className="space-y-4">
                {data.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{exp.poste}</h3>
                        <p className="text-gray-600 text-sm">{exp.entreprise}{exp.ville && `, ${exp.ville}`}{exp.pays && ` - ${exp.pays}`}</p>
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
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-400 border-b border-gray-200 pb-1">
                Formation
              </h2>
              <div className="space-y-3">
                {data.formations.map((formation) => (
                  <div key={formation.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{formation.diplome}</h3>
                        <p className="text-gray-600 text-sm">{formation.etablissement}{formation.ville && `, ${formation.ville}`}</p>
                        {formation.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{formation.description}</p>
                        )}
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
        </div>
      </div>
    </div>
  )
}
