import { Mail, Phone, MapPin, Linkedin } from 'lucide-react'
import type { CVDonnees } from '@/lib/types'

interface CVPreviewModerneProps {
  data: CVDonnees
  showWatermark?: boolean
}

export function CVPreviewModerne({ data, showWatermark = false }: CVPreviewModerneProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  const getNiveauWidth = (niveau: string) => {
    switch (niveau) {
      case 'expert':
      case 'bilingue':
      case 'natif':
        return '100%'
      case 'avance':
      case 'courant':
        return '80%'
      case 'intermediaire':
        return '60%'
      default:
        return '40%'
    }
  }

  return (
    <div className="relative min-h-full bg-white p-8 text-gray-800" style={{ fontSize: '10pt', lineHeight: '1.4' }}>
      {/* Watermark (Filigrane) - Version premium au bas pour le plan gratuit */}
      {showWatermark && (
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center justify-center pointer-events-none">
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

      {/* Header */}
      <header className="border-b-2 border-primary pb-4 mb-6" style={{ borderColor: '#d97706' }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {data.informations_personnelles.prenom} {data.informations_personnelles.nom}
            </h1>
            <p className="text-lg font-medium mt-1" style={{ color: '#d97706' }}>
              {data.titre_professionnel || 'Titre professionnel'}
            </p>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
          {data.informations_personnelles.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>{data.informations_personnelles.email}</span>
            </div>
          )}
          {data.informations_personnelles.telephone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{data.informations_personnelles.telephone}</span>
            </div>
          )}
          {data.informations_personnelles.adresse && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{data.informations_personnelles.adresse}</span>
            </div>
          )}
          {data.informations_personnelles.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-3 w-3" />
              <span>{data.informations_personnelles.linkedin}</span>
            </div>
          )}
        </div>
      </header>

      {/* Resume */}
      {data.resume && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#d97706' }}>
            Profil
          </h2>
          <p className="text-gray-700">{data.resume}</p>
        </section>
      )}

      {/* Experience */}
      {data.experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#d97706' }}>
            Experience professionnelle
          </h2>
          <div className="space-y-4">
            {data.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.poste}</h3>
                    <p className="text-gray-600">{exp.entreprise}{exp.ville && `, ${exp.ville}`}</p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(exp.date_debut)} - {exp.en_cours ? 'Present' : formatDate(exp.date_fin)}
                  </span>
                </div>
                {exp.description && (
                  <p className="mt-1 text-gray-700 text-sm">{exp.description}</p>
                )}
                {exp.realisations.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-0.5">
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
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#d97706' }}>
            Formation
          </h2>
          <div className="space-y-3">
            {data.formations.map((formation) => (
              <div key={formation.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{formation.diplome}</h3>
                  <p className="text-gray-600">{formation.etablissement}{formation.ville && `, ${formation.ville}`}</p>
                  {formation.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{formation.description}</p>
                  )}
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap">
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
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#d97706' }}>
              Competences
            </h2>
            <div className="space-y-2">
              {data.competences.map((comp) => (
                <div key={comp.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{comp.nom}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: getNiveauWidth(comp.niveau), backgroundColor: '#d97706' }}
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
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#d97706' }}>
              Langues
            </h2>
            <div className="space-y-2">
              {data.langues.map((langue) => (
                <div key={langue.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{langue.nom}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: getNiveauWidth(langue.niveau), backgroundColor: '#d97706' }}
                    />
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
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#d97706' }}>
            Centres d&apos;interet
          </h2>
          <div className="flex flex-wrap gap-2">
            {(data.centres_interet || []).map((interet, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
              >
                {interet}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
