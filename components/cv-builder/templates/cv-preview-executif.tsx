import { Mail, Phone, MapPin, Linkedin } from 'lucide-react'
import type { CVDonnees } from '@/lib/types'

interface CVPreviewExecutifProps {
  data: CVDonnees
  showWatermark?: boolean
}

export function CVPreviewExecutif({ data, showWatermark = false }: CVPreviewExecutifProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="relative min-h-full bg-white text-gray-800" style={{ fontSize: '10pt', lineHeight: '1.5' }}>
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

      {/* Top bar */}
      <div className="h-2 bg-gray-900" />

      <div className="p-8">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-light text-gray-900 tracking-wide">
            {data.informations_personnelles.prenom} <span className="font-bold">{data.informations_personnelles.nom}</span>
          </h1>
          <div className="w-16 h-0.5 bg-gray-900 mx-auto my-3" />
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 font-medium">
            {data.titre_professionnel}
          </p>
          <div className="flex justify-center flex-wrap gap-4 mt-4 text-xs text-gray-500">
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
        </header>

        {/* Resume */}
        {data.resume && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-3 text-gray-400">
              Profil professionnel
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed italic">{data.resume}</p>
          </section>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-3 text-gray-400">
              Parcours professionnel
            </h2>
            <div className="space-y-5">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.poste}</h3>
                      <p className="text-gray-600 text-sm">{exp.entreprise}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 ml-2 font-medium">
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
                          <span className="text-gray-900 mt-1">—</span>
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
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-3 text-gray-400">
              Formation
            </h2>
            <div className="space-y-3">
              {data.formations.map((formation) => (
                <div key={formation.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900">{formation.diplome}</h3>
                    <p className="text-gray-600 text-sm">{formation.etablissement}{formation.ville && `, ${formation.ville}`}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 ml-2">
                    {formatDate(formation.date_debut)} — {formation.en_cours ? 'Present' : formatDate(formation.date_fin)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {/* Competences */}
          {data.competences.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-3 text-gray-400">
                Competences
              </h2>
              <div className="space-y-2">
                {data.competences.map((comp) => (
                  <div key={comp.id} className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{comp.nom}</span>
                    <span className="text-[10px] text-gray-400 uppercase">
                      {comp.niveau}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Langues */}
          {data.langues.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-3 text-gray-400">
                Langues
              </h2>
              <div className="space-y-1">
                {data.langues.map((langue) => (
                  <div key={langue.id} className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{langue.nom}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-medium">
                      {langue.niveau}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Centres d'interet */}
        {(data.centres_interet || []).length > 0 && (
          <section className="mt-6 pt-4 border-t border-gray-100">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-2 text-gray-400">
              Centres d&apos;interet
            </h2>
            <div className="flex flex-wrap gap-3">
              {(data.centres_interet || []).map((interet, index) => (
                <span key={index} className="text-sm text-gray-600">
                  {interet}{index < (data.centres_interet || []).length - 1 ? ' /' : ''}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
