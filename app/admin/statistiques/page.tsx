'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, FileText, DollarSign, CreditCard, TrendingUp, UserCheck, Loader2, Mail, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Stats {
  users: { total: number; newThisMonth: number }
  cvs: { total: number; thisMonth: number }
  paidUsers: number
  payments: { thisMonth: number; pending: number; approved: number }
  revenue: { total: number; manual: number; auto: number }
  approvalRate: number
  lettres: number
  simulations: number
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => {
        if (d.success) setStats(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!stats) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Erreur de chargement</div>
  }

  const pieData = [
    { name: 'Approuvés', value: stats.payments.approved, color: '#22c55e' },
    { name: 'En attente', value: stats.payments.pending, color: '#f59e0b' },
  ]

  const barData = [
    { name: 'CV', value: stats.cvs.thisMonth, fill: '#c85032' },
    { name: 'Lettres', value: stats.lettres, fill: '#8b5cf6' },
    { name: 'Simulations', value: stats.simulations, fill: '#06b6d4' },
  ]

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="rounded-full">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight mt-2">Statistiques</h1>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                CA du mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.revenue.total.toLocaleString()} FCFA</div>
              <p className="text-xs text-muted-foreground mt-1">Auto: {stats.revenue.auto.toLocaleString()} | Manuel: {stats.revenue.manual.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Taux d&apos;approbation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvalRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.payments.approved} approuvés / {stats.payments.approved + stats.payments.pending} total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <UserCheck className="h-3 w-3" />
                Abonnés payants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.paidUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">sur {stats.users.total} utilisateurs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Users className="h-3 w-3" />
                Nouveaux utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.users.newThisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">ce mois-ci</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Activité du mois</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Paiements manuels</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {pieData[0].value + pieData[1].value > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground py-12">Aucun paiement manuel</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Résumé</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3" /> CV totaux</p>
              <p className="text-xl font-bold">{stats.cvs.total}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3" /> CV ce mois</p>
              <p className="text-xl font-bold">{stats.cvs.thisMonth}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" /> Lettres générées</p>
              <p className="text-xl font-bold">{stats.lettres}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Simulations</p>
              <p className="text-xl font-bold">{stats.simulations}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><CreditCard className="h-3 w-3" /> Paiements ce mois</p>
              <p className="text-xl font-bold">{stats.payments.thisMonth}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Conversion</p>
              <p className="text-xl font-bold">{stats.users.total > 0 ? Math.round(stats.paidUsers / stats.users.total * 100) : 0}%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
