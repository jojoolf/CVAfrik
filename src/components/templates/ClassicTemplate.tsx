import React from "react";
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Award, Code } from "lucide-react";

interface CVData {
  profile: {
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
  };
  experiences: Array<{
    company: string;
    role: string;
    period: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
}

export default function ClassicTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-slate-900 p-12 max-w-[800px] mx-auto shadow-2xl min-h-[1100px] font-serif border border-slate-200">
      {/* Header */}
      <header className="border-b-2 border-slate-900 pb-8 mb-10 text-center">
        <h1 className="text-4xl font-black uppercase tracking-widest mb-2">
          {data.profile.first_name} {data.profile.last_name}
        </h1>
        <p className="text-xl font-bold text-slate-700 italic mb-6">{data.profile.title}</p>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Mail size={14} />
            {data.profile.email}
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} />
            {data.profile.phone}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            {data.profile.address}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        {/* Left Column */}
        <div className="col-span-8 space-y-10">
          {/* Summary */}
          <section>
            <h2 className="text-lg font-black uppercase border-b border-slate-300 pb-1 mb-4 flex items-center gap-2">
              <User size={18} /> Profil Professionnel
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              {data.profile.summary || "Professionnel dynamique avec une expertise confirmée..."}
            </p>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-lg font-black uppercase border-b border-slate-300 pb-1 mb-6 flex items-center gap-2">
              <Briefcase size={18} /> Expériences Professionnelles
            </h2>
            <div className="space-y-8">
              {data.experiences.map((exp, i) => (
                <div key={i} className="relative">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base">{exp.role}</h3>
                    <span className="text-xs font-bold text-slate-500">{exp.period}</span>
                  </div>
                  <div className="text-sm font-bold text-blue-800 mb-2">{exp.company}</div>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-10">
          {/* Education */}
          <section>
            <h2 className="text-lg font-black uppercase border-b border-slate-300 pb-1 mb-4 flex items-center gap-2">
              <GraduationCap size={18} /> Formation
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="text-sm font-black">{edu.degree}</div>
                  <div className="text-xs text-slate-600">{edu.school}</div>
                  <div className="text-xs font-bold text-slate-400 mt-1">{edu.year}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-lg font-black uppercase border-b border-slate-300 pb-1 mb-4 flex items-center gap-2">
              <Code size={18} /> Compétences
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-bold">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Languages or Awards */}
          <section>
            <h2 className="text-lg font-black uppercase border-b border-slate-300 pb-1 mb-4 flex items-center gap-2">
              <Award size={18} /> Langues & Autres
            </h2>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Français</span>
                <span className="font-bold">Langue maternelle</span>
              </div>
              <div className="flex justify-between">
                <span>Anglais</span>
                <span className="font-bold">Avancé (B2)</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// User import was missing in classic template
import { User } from "lucide-react";
