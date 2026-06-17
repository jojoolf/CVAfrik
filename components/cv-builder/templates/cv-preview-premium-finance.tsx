import { Mail, Phone, MapPin, Linkedin, Award } from 'lucide-react'
import type { CVDonnees } from '@/lib/types'

interface CVPreviewPremiumFinanceProps {
  data: CVDonnees
  showWatermark?: boolean
}

export function CVPreviewPremiumFinance({ data, showWatermark = false }: CVPreviewPremiumFinanceProps) {
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

      <div className="flex min-h-full">
        {/* Left sidebar - Bleu marine */}
        <div className="w-[35%] bg-[#1e3a8a] p-6 text-white">
          <div className="text-center mb-6">
            {data.informations_personnelles.photo && (
              <img
                src={data.informations_personnelles.photo}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-3 border-amber-400"
              />
            )}
            <h1 className="text-lg font-bold leading-tight">
              {data.informations_personnelles.prenom} {data.informations_personnelles.nom}
            </h1>
            <div className="mt-2 h-0.5 w-12 bg-amber-400 mx-auto" />
            <p className="text-xs mt-2 text-blue-200 uppercase tracking-[0.15em] font-semibold">
              {data.titre_professionnel}
            </p>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-amber-400 border-b border-blue-700 pb-1">Contact</h2>
            <div className="space-y-2.5 text-xs">
              {data.informations_personnelles.email && (
                <p className="flex items-center gap-2 text-blue-100">
                  <Mail className="h-3 w-3 shrink-0 text-amber-400" />
                  <span className="break-all">{data.informations_personnelles.email}</span>
                </p>
              )}
              {data.informations_personnelles.telephone && (
                <p className="flex items-center gap-2 text-blue-100">
                  <Phone className="h-3 w-3 shrink-0 text-amber-400" />
                  <span>{data.informations_personnelles.telephone}</span>
                </p>
              )}
              {data.informations_personnelles.adresse && (
                <p className="flex items-center gap-2 text-blue-100">
                  <MapPin className="h-3 w-3 shrink-0 text-amber-400" />
                  <span>{data.informations_personnelles.adresse}</span>
                </p>
              )}
              {data.informations_personnelles.linkedin && (
                <p className="flex items-center gap-2 text-blue-100">
                  <Linkedin className="h-3 w-3 shrink-0 text-amber-400" />
                  <span className="break-all">{data.informations_personnelles.linkedin}</span>
                </p>
              )}
            </div>
          </div>

          {/* Compétences avec barres */}
          {data.competences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-amber-400 border-b border-blue-700 pb-1">Compétences</h2>
              <div className="space-y-2.5">
                {data.competences.map((comp) => (
                  <div key={comp.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-blue-100 font-medium">{comp.nom}</span>
                      <span className="text-amber-300 text-[9px]">
                        {comp.niveau === 'expert' ? '100%' : comp.niveau === 'avance' ? '80%' : comp.niveau === 'intermediaire' ? '60%' : '40%'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-blue-900/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300"
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
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-amber-400 border-b border-blue-700 pb-1">Langues</h2>
              <div className="space-y-1.5">
                {data.langues.map((langue) => (
                  <div key={langue.id} className="flex justify-between text-xs">
                    <span className="text-blue-100">{langue.nom}</span>
                    <span className="text-amber-300 capitalize text-[9px]">{langue.niveau}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {(data.certifications || []).length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-amber-400 border-b border-blue-700 pb-1">Certifications</h2>
              <div className="space-y-2">
                {(data.certifications || []).map((cert) => (
                  <div key={cert.id} className="flex items-start gap-2">
                    <Award className="h-3 w-3 shrink-0 text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-blue-100 font-medium">{cert.nom}</p>
                      <p className="text-[9px] text-blue-300">{cert.organisme}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right content */}
        <div className="w-[65%] p-6 bg-slate-50">
          {/* Résumé */}
          {data.resume && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-2 text-[#1e3a8a] flex items-center gap-2">
                <span className="w-6 h-0.5 bg-amber-400" />
                Profil professionnel
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">{data.resume}</p>
            </section>
          )}

          {/* Expériences */}
          {data.experiences.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-3 text-[#1e3a8a] flex items-center gap-2">
                <span className="w-6 h-0.5 bg-amber-400" />
                Expérience professionnelle
              </h2>
              <div className="space-y-4">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-amber-400">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#1e3a8a] border border-amber-400" />
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{exp.poste}</h3>
                        <p className="text-[#1e3a8a] text-xs font-semibold">{exp.entreprise}{exp.ville && `, ${exp.ville}`}</p>
                      </div>
                      <span className="text-[9px] text-gray-500 whitespace-nowrap shrink-0 ml-2 bg-blue-50 px-1.5 py-0.5 rounded font-medium">
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
                            <span className="text-amber-500 mt-1">▪</span>
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
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-3 text-[#1e3a8a] flex items-center gap-2">
                <span className="w-6 h-0.5 bg-amber-400" />
                Formation
              </h2>
              <div className="space-y-3">
                {data.formations.map((formation) => (
                  <div key={formation.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{formation.diplome}</h3>
                      <p className="text-gray-600 text-xs">{formation.etablissement}{formation.ville && `, ${formation.ville}`}</p>
                    </div>
                    <span className="text-[9px] text-gray-500 whitespace-nowrap shrink-0 ml-2 font-medium">
                      {formatDate(formation.date_debut)} - {formation.en_cours ? 'Présent' : formatDate(formation.date_fin)}
                    </span>
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
