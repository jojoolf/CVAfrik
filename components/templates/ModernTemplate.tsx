import React from "react";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Code, Star } from "lucide-react";

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

export default function ModernTemplate({ data }: { data: CVData }) {
  return (
    <div className="flex bg-white max-w-[800px] mx-auto shadow-2xl min-h-[1100px] font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-[280px] bg-slate-900 text-white p-10 flex flex-col">
        <div className="mb-10">
          <div className="w-32 h-32 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-black">
            {data.profile.first_name[0]}{data.profile.last_name[0]}
          </div>
          <h1 className="text-2xl font-black text-center mb-1 leading-tight">
            {data.profile.first_name} <br /> {data.profile.last_name}
          </h1>
          <p className="text-primary/80 text-xs font-bold text-center uppercase tracking-widest">
            {data.profile.title}
          </p>
        </div>

        <div className="space-y-8 flex-grow">
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Contact</h2>
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <Mail size={14} className="text-primary" />
                </div>
                <span className="break-all">{data.profile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <Phone size={14} className="text-primary" />
                </div>
                <span>{data.profile.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <MapPin size={14} className="text-primary" />
                </div>
                <span>{data.profile.address}</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Compétences</h2>
            <div className="space-y-3">
              {data.skills.map((skill, i) => (
                <div key={i}>
                  <div className="text-[11px] font-bold mb-1 flex justify-between">
                    <span>{skill}</span>
                    <span className="text-primary">90%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[90%]" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Formation</h2>
            <div className="space-y-5">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="text-[11px] font-black text-primary mb-1">{edu.year}</div>
                  <div className="text-[11px] font-bold leading-tight mb-1">{edu.degree}</div>
                  <div className="text-[10px] text-slate-400 italic">{edu.school}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 pt-10 border-t border-white/10 flex items-center gap-2">
          <Star size={16} className="text-yellow-400" />
          <span className="text-[10px] font-bold text-slate-400">Généré par CVAfrik</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-grow p-12 bg-slate-50 flex flex-col">
        <section className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            Profil
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            {data.profile.summary || "Professionnel passionné avec plus de 5 ans d'expérience..."}
          </p>
        </section>

        <section className="flex-grow">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg text-primary text-[10px] font-black uppercase tracking-widest mb-8">
            Expériences
          </div>
          <div className="space-y-10">
            {data.experiences.map((exp, i) => (
              <div key={i} className="relative pl-8 border-l border-slate-200">
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white shadow-sm" />
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-base font-black text-slate-800">{exp.role}</h3>
                  <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {exp.period}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-500 mb-3">{exp.company}</div>
                <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
