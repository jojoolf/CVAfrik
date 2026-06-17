import { Mail, Phone, MapPin, Linkedin } from 'lucide-react'
import type { CVDonnees } from '@/lib/types'

interface CVPreviewPremiumMarketingProps {
  data: CVDonnees
  showWatermark?: boolean
}

export function CVPreviewPremiumMarketing({ data, showWatermark = false }: CVPreviewPremiumMarketingProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  const sectionColors = [
    { dot: 'bg-purple-500', text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { dot: 'bg-pink-500', text: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
    { dot: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  ]

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

      {/* Top color band */}
      <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400" />

      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          {data.informations_personnelles.photo && (
            <img
              src={data.informations_personnelles.photo}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-3 border-purple-200 shadow-md"
            />
          )}
          <h1 className="text-2xl font-black text-gray-900">
            {data.informations_personnelles.prenom} {data.informations_personnelles.nom}
          </h1>
          <p className="text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mt-1">
            {data.titre_professionnel}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs text-gray-500">
            {data.informations_personnelles.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3 text-purple-400" /> {data.informations_personnelles.email}
              </span>
            )}
            {data.informations_personnelles.telephone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-pink-400" /> {data.informations_personnelles.telephone}
              </span>
            )}
            {data.informations_personnelles.adresse && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-orange-400" /> {data.informations_personnelles.adresse}
              </span>
            )}
            {data.informations_personnelles.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="h-3 w-3 text-purple-400" /> {data.informations_personnelles.linkedin}
              </span>
            )}
          </div>
        </div>

        {/* Résumé */}
        {data.resume && (
          <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 border border-purple-100">
            <p className="text-gray-600 text-sm leading-relaxed text-center italic">{data.resume}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-5">
          {/* Left: Main content */}
          <div className="col-span-2 space-y-5">
            {/* Expériences avec timeline */}
            {data.experiences.length > 0 && (
              <section>
                <h2 className="text-xs font-black uppercase tracking-[0.15em] text-purple-600 mb-3 flex items-center gap-2">
                  <span className="h-4 w-1 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
                  Expérience
                </h2>
                <div className="space-y-4">
                  {data.experiences.map((exp, idx) => {
                    const color = sectionColors[idx % sectionColors.length]
                    return (
                      <div key={exp.id} className="relative pl-5">
                        {/* Timeline line */}
                        <div className="absolute left-1.5 top-2 bottom-0 w-px bg-gradient-to-b from-purple-300 to-pink-200" />
                        {/* Timeline dot */}
                        <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full ${color.dot} border-2 border-white shadow-sm`} />
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">{exp.poste}</h3>
                            <p className={`text-xs font-semibold ${color.text}`}>{exp.entreprise}{exp.ville && ` · ${exp.ville}`}</p>
                          </div>
                          <span className={`text-[9px] ${color.text} ${color.bg} px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ml-2 border ${color.border}`}>
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
                                <span className={`${color.text} mt-0.5`}>✦</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Formation */}
            {data.formations.length > 0 && (
              <section>
                <h2 className="text-xs font-black uppercase tracking-[0.15em] text-pink-600 mb-3 flex items-center gap-2">
                  <span className="h-4 w-1 rounded-full bg-gradient-to-b from-pink-500 to-orange-500" />
                  Formation
                </h2>
                <div className="space-y-2">
                  {data.formations.map((formation) => (
                    <div key={formation.id} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{formation.diplome}</h3>
                        <p className="text-gray-500 text-xs">{formation.etablissement}{formation.ville && `, ${formation.ville}`}</p>
                      </div>
                      <span className="text-[9px] text-gray-500 font-medium whitespace-nowrap ml-2">
                        {formatDate(formation.date_debut)} - {formation.en_cours ? 'Présent' : formatDate(formation.date_fin)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Compétences */}
            {data.competences.length > 0 && (
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.15em] text-orange-600 mb-2 flex items-center gap-2">
                  <span className="h-3 w-1 rounded-full bg-orange-400" />
                  Compétences
                </h2>
                <div className="space-y-1.5">
                  {data.competences.map((comp, idx) => {
                    const colors = ['from-purple-400 to-purple-500', 'from-pink-400 to-pink-500', 'from-orange-400 to-orange-500']
                    const color = colors[idx % colors.length]
                    return (
                      <div key={comp.id}>
                        <div className="flex justify-between text-[9px] mb-0.5">
                          <span className="text-gray-700 font-medium">{comp.nom}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${color}`}
                            style={{
                              width: comp.niveau === 'expert' ? '100%' : comp.niveau === 'avance' ? '80%' : comp.niveau === 'intermediaire' ? '60%' : '40%'
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Langues */}
            {data.langues.length > 0 && (
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.15em] text-purple-600 mb-2 flex items-center gap-2">
                  <span className="h-3 w-1 rounded-full bg-purple-400" />
                  Langues
                </h2>
                <div className="space-y-1">
                  {data.langues.map((langue) => (
                    <div key={langue.id} className="flex justify-between text-xs">
                      <span className="text-gray-700">{langue.nom}</span>
                      <span className="text-pink-500 capitalize text-[9px] font-semibold">{langue.niveau}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Centres d'intérêt */}
            {(data.centres_interet || []).length > 0 && (
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.15em] text-pink-600 mb-2">Intérêts</h2>
                <div className="flex flex-wrap gap-1">
                  {(data.centres_interet || []).map((interet, index) => (
                    <span key={index} className="px-2 py-0.5 text-[9px] rounded-full bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 border border-purple-100 font-medium">
                      {interet}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
