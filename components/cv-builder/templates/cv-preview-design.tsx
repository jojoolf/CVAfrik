import { Mail, Phone, MapPin, Linkedin } from 'lucide-react'
import type { CVDonnees } from '@/lib/types'

interface CVPreviewDesignProps {
  data: CVDonnees
  showWatermark?: boolean
}

export function CVPreviewDesign({ data, showWatermark = false }: CVPreviewDesignProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="relative min-h-full bg-[#FDFBF7] text-gray-800 flex flex-col" style={{ fontSize: '10pt', lineHeight: '1.5' }}>
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

      {/* Top Header */}
      <div className="bg-[#EAE4D9] px-10 py-8 relative">
        <div className="flex justify-between items-end relative z-10">
          <div>
            <h1 className="text-4xl font-light tracking-wide text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              <span className="font-bold">{data.informations_personnelles.nom}</span><br />
              {data.informations_personnelles.prenom}
            </h1>
            <p className="text-sm uppercase tracking-[0.3em] font-bold text-gray-600 mt-4">
              {data.titre_professionnel}
            </p>
          </div>

          {data.informations_personnelles.photo && (
            <div className="absolute -bottom-16 right-0 border-8 border-[#FDFBF7] rounded-full overflow-hidden shadow-sm">
              <img 
                src={data.informations_personnelles.photo} 
                alt="Profile" 
                className="w-32 h-32 object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Contact Bar */}
      <div className="bg-gray-900 text-white px-10 py-3 text-[10px] flex flex-wrap justify-between items-center z-10">
        {data.informations_personnelles.telephone && (
          <span className="flex items-center gap-2"><Phone className="w-3 h-3 text-[#EAE4D9]" /> {data.informations_personnelles.telephone}</span>
        )}
        {data.informations_personnelles.email && (
          <span className="flex items-center gap-2"><Mail className="w-3 h-3 text-[#EAE4D9]" /> {data.informations_personnelles.email}</span>
        )}
        {data.informations_personnelles.adresse && (
          <span className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[#EAE4D9]" /> {data.informations_personnelles.adresse}</span>
        )}
      </div>

      <div className="flex flex-1 p-10 pt-16 gap-10">
        {/* Left Column */}
        <div className="w-[30%] space-y-8">
          {data.resume && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4 border-b border-gray-300 pb-2">Profil</h2>
              <p className="text-xs leading-relaxed text-gray-600 text-justify">{data.resume}</p>
            </section>
          )}

          {data.competences.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4 border-b border-gray-300 pb-2">Competences</h2>
              <div className="space-y-3">
                {data.competences.map((comp) => (
                  <div key={comp.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-800 font-medium">{comp.nom}</span>
                      <span className="text-gray-400 capitalize">{comp.niveau}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                      <div className={`h-full bg-gray-700 ${comp.niveau === 'expert' ? 'w-full' : comp.niveau === 'avance' ? 'w-3/4' : comp.niveau === 'intermediaire' ? 'w-1/2' : 'w-1/4'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.langues.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4 border-b border-gray-300 pb-2">Langues</h2>
              <div className="space-y-2">
                {data.langues.map((langue) => (
                  <div key={langue.id} className="text-xs text-gray-600">
                    <span className="font-bold text-gray-800">{langue.nom}</span> - {langue.niveau}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="w-[70%] space-y-8">
          {data.experiences.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-300 pb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#EAE4D9] rounded-full inline-block"></span>
                Experiences
              </h2>
              <div className="space-y-6">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-[#EAE4D9]">
                    <div className="absolute w-2 h-2 rounded-full bg-gray-900 -left-[5px] top-1"></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900">{exp.poste}</h3>
                      <span className="text-xs font-bold text-[#bfa888] bg-[#EAE4D9]/30 px-2 py-0.5 rounded">
                        {formatDate(exp.date_debut)} - {exp.en_cours ? 'Present' : formatDate(exp.date_fin)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-2">{exp.entreprise}</p>
                    <p className="text-xs text-gray-600 leading-relaxed mb-2">{exp.description}</p>
                    {exp.realisations.length > 0 && (
                      <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside ml-2">
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

          {data.formations.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-300 pb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#EAE4D9] rounded-full inline-block"></span>
                Formations
              </h2>
              <div className="space-y-4">
                {data.formations.map((formation) => (
                  <div key={formation.id} className="relative pl-4 border-l-2 border-[#EAE4D9]">
                    <div className="absolute w-2 h-2 rounded-full bg-gray-900 -left-[5px] top-1"></div>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-gray-900">{formation.diplome}</h3>
                      <span className="text-xs font-bold text-[#bfa888]">
                        {formatDate(formation.date_debut)} - {formation.en_cours ? 'Present' : formatDate(formation.date_fin)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{formation.etablissement}</p>
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
