'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, ArrowRight } from 'lucide-react'

export function MobileMoneySection() {
  return (
    <section className="relative border-y border-border bg-card/30 backdrop-blur py-10 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-30" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left side info */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left max-w-xl">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              Paiement 100% sécurisé via Mobile Money
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Activez votre accès instantanément sans carte bancaire, directement avec votre compte mobile.
            </p>
          </div>
        </div>

        {/* Right side logos */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {/* Orange Money */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center h-12 w-28 rounded-xl bg-[#FF6600]/10 border border-[#FF6600]/20 p-1"
          >
            <svg viewBox="0 0 120 40" className="h-7 w-auto">
              <rect x="5" y="5" width="30" height="30" rx="6" fill="#FF6600"/>
              <rect x="15" y="15" width="10" height="10" fill="#FFFFFF"/>
              <text x="80" y="25" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="13" fill="#FF6600" textAnchor="middle">orange</text>
            </svg>
          </motion.div>

          {/* MTN MoMo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center h-12 w-28 rounded-xl bg-[#FFCC00]/10 border border-[#FFCC00]/20 p-1"
          >
            <svg viewBox="0 0 120 40" className="h-7 w-auto">
              <rect x="5" y="5" width="110" height="30" rx="8" fill="#FFCC00"/>
              <ellipse cx="60" cy="20" rx="28" ry="12" fill="none" stroke="#003399" strokeWidth="2"/>
              <text x="60" y="24" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="11" fill="#003399" textAnchor="middle">mtn momo</text>
            </svg>
          </motion.div>

          {/* Moov Money */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center h-12 w-28 rounded-xl bg-[#0066B3]/10 border border-[#0066B3]/20 p-1"
          >
            <svg viewBox="0 0 120 40" className="h-7 w-auto">
              <rect x="5" y="5" width="110" height="30" rx="8" fill="#0066B3"/>
              <text x="60" y="24" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" textAnchor="middle">
                moov<tspan fill="#FF6600">.money</tspan>
              </text>
            </svg>
          </motion.div>

          {/* Wave */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center h-12 w-28 rounded-xl bg-[#1CA9E2]/10 border border-[#1CA9E2]/20 p-1"
          >
            <svg viewBox="0 0 120 40" className="h-7 w-auto">
              <rect x="5" y="5" width="110" height="30" rx="8" fill="#1CA9E2"/>
              <path d="M 22 20 Q 32 10 42 20 T 62 20" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
              <text x="75" y="24" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" textAnchor="middle">wave</text>
            </svg>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
