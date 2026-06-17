import { Mail, Phone, MapPin, Linkedin, Award, Briefcase } from 'lucide-react'
import type { CVDonnees } from '@/lib/types'

interface CVPreviewPremiumExecutiveProps {
  data: CVDonnees
  showWatermark?: boolean
}

export function CVPreviewPremiumExecutive({ data, showWatermark = false }: CVPreviewPremiumExecutiveProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="relative min-h-full bg-[#111827] text-gray-100" style={{ fontSize: '10pt', lineHeight: '1.4' }}>
      {showWatermark && (
        <div className="absolute bottom-4 left-0 right-0 z-50 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-900/90 rounded-full border border-amber-500/20 shadow-lg">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-amber-500">
              <span className="text-[10px] font-bold text-black">CV</span>
            </div>
            <span className="text-[11px] font-bold text-gray-400">
              Créé avec <span className="text-amber-500 font-bold">CVAfrik</span>
            </span>
          </div>
        </div>
      )}

      {/* Top Header Section */}
      <div className="border-b border-amber-500/20 bg-gray-900/60 backdrop-blur-md p-8 relative overflow-hidden">
        {/* Subtle decorative gold light */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            {data.informations_personnelles.photo && (
              <img
                src={data.informations_personnelles.photo}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-amber-500/60 shadow-lg"
              />
            )}
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">
                {data.informations_personnelles.prenom} <span className="text-amber-400">{data.informations_personnelles.nom}</span>
              </h1>
              <p className="text-sm mt-1 text-gray-400 font-medium tracking-[0.2em] uppercase">
                {data.titre_professionnel}
              </p>
            </div>
          </div>

          {/* Quick Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-gray-400 border-l border-amber-500/20 pl-6">
            {data.informations_personnelles.email && (
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-amber-500" />
                <span className="break-all">{data.informations_personnelles.email}</span>
              </p>
            )}
            {data.informations_personnelles.telephone && (
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-amber-500" />
                <span>{data.informations_personnelles.telephone}</span>
              </p>
            )}
            {data.informations_personnelles.adresse && (
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                <span>{data.informations_personnelles.adresse}</span>
              </p>
            )}
            {data.informations_personnelles.linkedin && (
              <p className="flex items-center gap-2">
                <Linkedin className="h-3.5 w-3.5 text-amber-500" />
                <span className="break-all">{data.informations_personnelles.linkedin}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
        {/* Left Column (1/3 width) */}
        <div className="space-y-8 lg:col-span-1">
          {/* Executive Summary */}
          {data.resume && (
            <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-5 backdrop-blur-sm">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-3 flex items-center gap-2">
                <Briefcase className="h-4.5 w-4.5 text-amber-500" />
                Résumé Exécutif
              </h2>
              <p className="text-gray-300 text-xs leading-relaxed">{data.resume}</p>
            </div>
          )}

          {/* Competences / Core Strengths */}
          {data.competences.length > 0 && (
            <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-5 backdrop-blur-sm">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-4">
                Expertises Clés
              </h2>
              <div className="space-y-3">
                {data.competences.map((comp) => (
                  <div key={comp.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-200 font-medium">{comp.nom}</span>
                      <span className="text-amber-400/80 text-[10px] uppercase font-semibold">
                        {comp.niveau === 'expert' ? 'Expert' : comp.niveau === 'avance' ? 'Avancé' : comp.niveau === 'intermediaire' ? 'Intermédiaire' : 'Débutant'}
                      </span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
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

          {/* Languages */}
          {data.langues.length > 0 && (
            <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-5 backdrop-blur-sm">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-3">
                Langues
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {data.langues.map((langue) => (
                  <div key={langue.id} className="bg-gray-800/40 border border-gray-800 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-200 font-semibold">{langue.nom}</p>
                    <p className="text-[10px] text-amber-500/80 capitalize mt-0.5">{langue.niveau}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {(data.certifications || []).length > 0 && (
            <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-5 backdrop-blur-sm">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-3">
                Certifications
              </h2>
              <div className="space-y-3.5">
                {(data.certifications || []).map((cert) => (
                  <div key={cert.id} className="flex gap-3 items-start">
                    <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Award className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-200 font-bold">{cert.nom}</p>
                      <p className="text-[10px] text-gray-400">{cert.organisme}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (2/3 width) - Experience & Education */}
        <div className="space-y-8 lg:col-span-2">
          {/* Experiences */}
          {data.experiences.length > 0 && (
            <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-6 pb-2 border-b border-gray-800">
                Parcours Professionnel
              </h2>
              <div className="space-y-6">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l border-amber-500/20">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                      <div>
                        <h3 className="font-extrabold text-sm text-white">{exp.poste}</h3>
                        <p className="text-xs text-amber-400 font-semibold">{exp.entreprise}{exp.ville && `, ${exp.ville}`}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 bg-gray-800 border border-gray-700 px-2.5 py-0.5 rounded-full font-medium">
                        {formatDate(exp.date_debut)} - {exp.en_cours ? 'Présent' : formatDate(exp.date_fin)}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-300 leading-relaxed mb-2">{exp.description}</p>
                    )}
                    {exp.realisations.length > 0 && (
                      <ul className="space-y-1">
                        {exp.realisations.map((r, i) => (
                          <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="text-amber-500 mt-1 shrink-0">✦</span>
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
            <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-6 pb-2 border-b border-gray-800">
                Formations Académiques
              </h2>
              <div className="space-y-5">
                {data.formations.map((formation) => (
                  <div key={formation.id} className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-extrabold text-sm text-white">{formation.diplome}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{formation.etablissement}{formation.ville && `, ${formation.ville}`}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 bg-gray-800 border border-gray-700 px-2.5 py-0.5 rounded-full font-medium shrink-0">
                      {formatDate(formation.date_debut)} - {formation.en_cours ? 'Présent' : formatDate(formation.date_fin)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
