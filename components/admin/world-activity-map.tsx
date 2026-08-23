'use client'

import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

type CountryMetric = { country: string; users: number }

const COUNTRY_NUMERIC_BY_CODE: Record<string, string> = {
  DZ: '012', AO: '024', BJ: '204', BW: '072', BF: '854', BI: '108', CV: '132', CM: '120', CF: '140', TD: '148',
  KM: '174', CG: '178', CD: '180', CI: '384', DJ: '262', EG: '818', GQ: '226', ER: '232', SZ: '748', ET: '231',
  GA: '266', GM: '270', GH: '288', GN: '324', GW: '624', KE: '404', LS: '426', LR: '430', LY: '434', MG: '450',
  MW: '454', ML: '466', MR: '478', MU: '480', MA: '504', MZ: '508', NA: '516', NE: '562', NG: '566', RW: '646',
  ST: '678', SN: '686', SC: '690', SL: '694', SO: '706', ZA: '710', SS: '728', SD: '729', TZ: '834', TG: '768',
  TN: '788', UG: '800', ZM: '894', ZW: '716', FR: '250', GB: '826', US: '840', CA: '124', DE: '276', BE: '056',
  CH: '756', IT: '380', ES: '724', PT: '620', AE: '784', SA: '682', IN: '356', BR: '076', AU: '036', TR: '792',
}

const countryName = (code: string) => {
  if (code === 'Non renseigné') return code
  try {
    return new Intl.DisplayNames(['fr'], { type: 'region' }).of(code) || code
  } catch {
    return code
  }
}

export function WorldActivityMap({ countries, onlineByCountry }: { countries: CountryMetric[]; onlineByCountry: CountryMetric[] }) {
  const maxUsers = Math.max(1, ...countries.map((item) => item.users))
  const usersByCountryId = new Map(countries.map((item) => [COUNTRY_NUMERIC_BY_CODE[item.country], item.users]))
  const fillForCountry = (id: string) => {
    const users = usersByCountryId.get(id) || 0
    if (!users) return 'var(--muted)'
    const strength = users / maxUsers
    if (strength > 0.66) return '#f97316'
    if (strength > 0.33) return '#fb923c'
    return '#fdba74'
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-muted/55 dark:bg-slate-950/70">
      <ComposableMap projectionConfig={{ scale: 148 }} className="h-auto w-full" aria-label="Carte mondiale de la répartition des comptes CVAfrik">
        <Geographies geography="/maps/countries-110m.json">
          {({ geographies }) => geographies.map((geo) => {
            const users = usersByCountryId.get(String(geo.id)) || 0
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={fillForCountry(String(geo.id))}
                stroke="var(--border)"
                strokeWidth={0.45}
                style={{ default: { outline: 'none' }, hover: { outline: 'none', fill: users ? '#ea580c' : 'var(--accent)' }, pressed: { outline: 'none' } }}
              >
                <title>{users ? `${users} compte${users > 1 ? 's' : ''}` : 'Aucun compte enregistré'}</title>
              </Geography>
            )
          })}
        </Geographies>
      </ComposableMap>
      <div className="border-t border-border px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground"><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-muted-foreground/45" />Aucun compte</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-orange-300" />Présence faible</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-primary" />Présence forte</span></div>
        {onlineByCountry.length > 0 && <p className="mt-3 text-xs leading-5 text-emerald-700 dark:text-emerald-300">En ligne maintenant : {onlineByCountry.slice(0, 3).map((item) => `${item.users} ${countryName(item.country)}`).join(' · ')}</p>}
      </div>
    </div>
  )
}
