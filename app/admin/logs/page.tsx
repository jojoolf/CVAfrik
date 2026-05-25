'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Activity, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Log {
  id: string
  admin_email: string
  action: string
  details: Record<string, unknown> | null
  created_at: string
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = () => {
    setLoading(true)
    fetch('/api/admin/logs')
      .then(r => r.json())
      .then(d => {
        if (d.success) setLogs(d.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchLogs() }, [])

  const actionColors: Record<string, string> = {
    approve_payment: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    reject_payment: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    create_post: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    update_post: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    delete_post: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  const actionLabels: Record<string, string> = {
    approve_payment: 'Approbation paiement',
    reject_payment: 'Rejet paiement',
    create_post: 'Création article',
    update_post: 'Modification article',
    delete_post: 'Suppression article',
  }

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="max-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" size="sm" asChild className="rounded-full mb-2">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Retour
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Journal d&apos;activité</h1>
          </div>
          <Button variant="outline" size="sm" className="rounded-full" onClick={fetchLogs}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : logs.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Aucune activité pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">100 dernières actions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {logs.map((log) => (
                  <div key={log.id} className="px-6 py-4 flex items-start gap-4">
                    <div className={`shrink-0 mt-0.5 px-2.5 py-1 rounded-full text-xs font-medium ${actionColors[log.action] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {actionLabels[log.action] || log.action}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        Par <span className="font-medium">{log.admin_email}</span>
                      </p>
                      {log.details && (
                        <pre className="mt-1 text-xs text-muted-foreground bg-muted/50 rounded p-2 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground shrink-0">
                      {format(new Date(log.created_at), 'dd MMM HH:mm', { locale: fr })}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
