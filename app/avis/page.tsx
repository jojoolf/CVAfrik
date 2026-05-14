"use client";

import React, { useState } from "react";
import { Star, Send, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AvisPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Veuillez donner une note avec les étoiles.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Veuillez vous connecter pour laisser un avis.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("avis").insert({
        user_id: user.id,
        nom: user.user_metadata?.full_name || user.email?.split('@')[0],
        note: rating,
        commentaire: comment,
      });

      if (error) throw error;
      setSubmitted(true);
      toast.success("Merci pour votre avis !");
    } catch (err: any) {
      toast.error("Une erreur est survenue lors de l'envoi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-20 px-6">
        <div className="max-w-xl mx-auto">
          {submitted ? (
            <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl text-center border border-slate-100 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-4">Merci !</h1>
              <p className="text-slate-500 mb-10 leading-relaxed">
                Votre avis a bien été enregistré. Il aide la communauté à choisir CVAfrik pour booster leur carrière.
              </p>
              <Button asChild className="w-full py-7 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
                <a href="/dashboard">Retour au tableau de bord</a>
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100">
              <header className="mb-10 text-center">
                <h1 className="text-3xl font-black text-slate-900 mb-3">Votre avis compte</h1>
                <p className="text-slate-500 text-sm">Partagez votre expérience avec CVAfrik et aidez-nous à nous améliorer.</p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Star Rating */}
                <div className="space-y-4 text-center">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Note globale</Label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="transition-all transform hover:scale-110"
                      >
                        <Star
                          size={40}
                          className={`${
                            (hover || rating) >= star
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-3">
                  <Label htmlFor="comment" className="text-xs font-black uppercase text-slate-400 ml-1 tracking-widest">
                    Votre commentaire (optionnel)
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder="Qu'avez-vous pensé de nos templates et de nos conseils IA ?"
                    className="min-h-[150px] rounded-3xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all p-6 font-medium text-slate-700 resize-none"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-8 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 transition-all hover:translate-y-[-2px] active:translate-y-0"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : (
                    <Send size={20} className="mr-3" />
                  )}
                  Publier mon avis
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
