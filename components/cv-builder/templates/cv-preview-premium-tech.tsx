import { Mail, Phone, MapPin, Linkedin, Code } from 'lucide-react'
import type { CVDonnees } from '@/lib/types'

interface CVPreviewPremiumTechProps {
  data: CVDonnees
  showWatermark?: boolean
}

export function CVPreviewPremiumTech({ data, showWatermark = false }: CVPreviewPremiumTechProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="relative min-h-full bg-gray-50 text-gray-800" style={{ fontSize: '10pt', lineHeight: '1.4' }}>
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

      {/* Header gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
        <div className="flex items-center gap-4">
          {data.informations_personnelles.photo && (
            <img
              src={data.informations_personnelles.photo}
              alt="Profile"
              className="w-20 h-20 rounded-xl object-cover border-2 border-white/30"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {data.informations_personnelles.prenom} {data.informations_personnelles.nom}
            </h1>
            <p className="text-cyan-100 text-sm font-medium mt-0.5 flex items-center gap-1.5">
              <Code className="h-3.5 w-3.5" />
              {data.titre_professionnel}
            </p>
          </div>
        </div>
        {/* Contact row */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-cyan-100">
          {data.informations_personnelles.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> {data.informations_personnelles.email}
            </span>
          )}
          {data.informations_personnelles.telephone && (
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" /> {data.informations_personnelles.telephone}
            </span>
          )}
          {data.informations_personnelles.adresse && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> {data.informations_personnelles.adresse}
            </span>
          )}
          {data.informations_personnelles.linkedin && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="h-3 w-3" /> {data.informations_personnelles.linkedin}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Résumé */}
        {data.resume && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600 mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              À propos
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{data.resume}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-5">
          {/* Left: Experiences */}
          <div className="col-span-2 space-y-5">
            {data.experiences.length > 0 && (
              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600 mb-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Expérience
                </h2>
                <div className="space-y-3">
                  {data.experiences.map((exp) => (
                    <div key={exp.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 text-sm">{exp.poste}</h3>
                        <span className="text-[9px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ml-2">
                          {formatDate(exp.date_debut)} - {exp.en_cours ? 'Présent' : formatDate(exp.date_fin)}
                        </span>
                      </div>
                      <p className="text-blue-500 text-xs font-semibold mb-1">{exp.entreprise}{exp.ville && ` · ${exp.ville}`}</p>
                      {exp.description && (
                        <p className="text-gray-600 text-xs mb-1">{exp.description}</p>
                      )}
                      {exp.realisations.length > 0 && (
                        <ul className="space-y-0.5">
                          {exp.realisations.map((r, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                              <span className="text-cyan-500 mt-0.5">›</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formation */}
            {data.formations.length > 0 && (
              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600 mb-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Formation
                </h2>
                <div className="space-y-2">
                  {data.formations.map((formation) => (
                    <div key={formation.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{formation.diplome}</h3>
                          <p className="text-gray-500 text-xs">{formation.etablissement}</p>
                        </div>
                        <span className="text-[9px] text-gray-500 font-medium whitespace-nowrap ml-2">
                          {formatDate(formation.date_debut)} - {formation.en_cours ? 'Présent' : formatDate(formation.date_fin)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Compétences */}
            {data.competences.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600 mb-3 flex items-center gap-1.5">
                  <Code className="h-3 w-3 text-cyan-500" />
                  Compétences
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {data.competences.map((comp) => (
                    <span
                      key={comp.id}
                      className={`text-[9px] px-2 py-1 rounded-lg font-semibold ${
                        comp.niveau === 'expert' ? 'bg-blue-100 text-blue-700' :
                        comp.niveau === 'avance' ? 'bg-cyan-50 text-cyan-700' :
                        'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {comp.nom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Langues */}
            {data.langues.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600 mb-2">Langues</h2>
                <div className="space-y-1.5">
                  {data.langues.map((langue) => (
                    <div key={langue.id} className="flex justify-between text-xs">
                      <span className="text-gray-700">{langue.nom}</span>
                      <span className="text-cyan-600 capitalize text-[9px] font-semibold">{langue.niveau}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Centres d'intérêt */}
            {(data.centres_interet || []).length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600 mb-2">Intérêts</h2>
                <div className="flex flex-wrap gap-1">
                  {(data.centres_interet || []).map((interet, index) => (
                    <span key={index} className="px-2 py-0.5 text-[9px] rounded-full bg-gray-50 text-gray-600 border border-gray-100">
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
