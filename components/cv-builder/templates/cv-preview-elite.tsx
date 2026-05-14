import { Mail, Phone, MapPin, Linkedin } from 'lucide-react'
import type { CVDonnees } from '@/lib/types'

interface CVPreviewEliteProps {
  data: CVDonnees
  showWatermark?: boolean
}

export function CVPreviewElite({ data, showWatermark = false }: CVPreviewEliteProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="relative min-h-full bg-white flex" style={{ fontSize: '10pt', lineHeight: '1.5' }}>
      {showWatermark && (
        <div className="absolute bottom-4 left-1/3 right-0 z-50 flex flex-col items-center justify-center pointer-events-none">
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

      {/* Left Sidebar */}
      <div className="w-[35%] bg-[#0B1E36] text-white p-6 min-h-full">
        {data.informations_personnelles.photo && (
          <div className="flex justify-center mb-6">
            <img 
              src={data.informations_personnelles.photo} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-[#1E3A5F] shadow-lg"
            />
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-[#7AA2D1] border-b border-[#1E3A5F] pb-2">
            Contact
          </h2>
          <div className="space-y-3 text-sm text-gray-300">
            {data.informations_personnelles.telephone && (
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#7AA2D1] mt-0.5" />
                <span>{data.informations_personnelles.telephone}</span>
              </div>
            )}
            {data.informations_personnelles.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#7AA2D1] mt-0.5" />
                <span className="break-all">{data.informations_personnelles.email}</span>
              </div>
            )}
            {data.informations_personnelles.adresse && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-[#7AA2D1] mt-0.5" />
                <span>{data.informations_personnelles.adresse}</span>
              </div>
            )}
            {data.informations_personnelles.linkedin && (
              <div className="flex items-start gap-3">
                <Linkedin className="h-4 w-4 shrink-0 text-[#7AA2D1] mt-0.5" />
                <span className="break-all">{data.informations_personnelles.linkedin}</span>
              </div>
            )}
          </div>
        </div>

        {data.competences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-[#7AA2D1] border-b border-[#1E3A5F] pb-2">
              Competences
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.competences.map((comp) => (
                <span key={comp.id} className="bg-[#1E3A5F] text-white px-2 py-1 text-xs rounded">
                  {comp.nom}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.langues.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-[#7AA2D1] border-b border-[#1E3A5F] pb-2">
              Langues
            </h2>
            <div className="space-y-2">
              {data.langues.map((langue) => (
                <div key={langue.id} className="flex justify-between items-center text-sm text-gray-300">
                  <span>{langue.nom}</span>
                  <span className="text-[10px] uppercase text-[#7AA2D1]">{langue.niveau}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-[65%] p-8 bg-white text-gray-800">
        <header className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 tracking-wide mb-1">
            <span className="font-bold">{data.informations_personnelles.prenom}</span> {data.informations_personnelles.nom}
          </h1>
          <p className="text-lg text-[#0B1E36] font-medium tracking-wider uppercase mt-2">
            {data.titre_professionnel}
          </p>
        </header>

        {data.resume && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-[#0B1E36]">Profil</h2>
            <p className="text-sm leading-relaxed text-gray-600">{data.resume}</p>
          </section>
        )}

        {data.experiences.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-[#0B1E36] border-b-2 border-gray-100 pb-2">
              Experiences Professionnelles
            </h2>
            <div className="space-y-5">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.poste}</h3>
                      <p className="text-sm font-medium text-[#7AA2D1]">{exp.entreprise}{exp.ville && ` | ${exp.ville}`}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      {formatDate(exp.date_debut)} - {exp.en_cours ? 'Present' : formatDate(exp.date_fin)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
                  )}
                  {exp.realisations.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-600 space-y-1 list-disc list-inside">
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
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-[#0B1E36] border-b-2 border-gray-100 pb-2">
              Formations
            </h2>
            <div className="space-y-4">
              {data.formations.map((formation) => (
                <div key={formation.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{formation.diplome}</h3>
                      <p className="text-sm text-gray-600">{formation.etablissement}{formation.ville && `, ${formation.ville}`}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      {formatDate(formation.date_debut)} - {formation.en_cours ? 'Present' : formatDate(formation.date_fin)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {(data.centres_interet || []).length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-[#0B1E36] border-b-2 border-gray-100 pb-2">
              Centres d'interet
            </h2>
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              {(data.centres_interet || []).map((interet, index) => (
                <span key={index}>{interet}{index < (data.centres_interet || []).length - 1 ? ' • ' : ''}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
