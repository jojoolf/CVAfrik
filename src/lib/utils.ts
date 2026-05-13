export const formatCurrency = (amount: number, currency: string = "XOF") => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getCountryCurrency = (countryCode: string) => {
  const mapping: Record<string, { currency: string; rate: number }> = {
    TG: { currency: "XOF", rate: 600 }, // Togo
    CI: { currency: "XOF", rate: 600 }, // Côte d'Ivoire
    SN: { currency: "XOF", rate: 600 }, // Sénégal
    BJ: { currency: "XOF", rate: 600 }, // Bénin
    BF: { currency: "XOF", rate: 600 }, // Burkina
    ML: { currency: "XOF", rate: 600 }, // Mali
    NE: { currency: "XOF", rate: 600 }, // Niger
    GW: { currency: "XOF", rate: 600 }, // Guinée-Bissau
    CM: { currency: "XAF", rate: 600 }, // Cameroun
    GA: { currency: "XAF", rate: 600 }, // Gabon
    CG: { currency: "XAF", rate: 600 }, // Congo
    TD: { currency: "XAF", rate: 600 }, // Tchad
    CF: { currency: "XAF", rate: 600 }, // Centrafrique
    GQ: { currency: "XAF", rate: 600 }, // Guinée équatoriale
    GN: { currency: "GNF", rate: 9000 }, // Guinée Conakry
    CD: { currency: "CDF", rate: 2500 }, // RDC
    FR: { currency: "EUR", rate: 0.92 }, // France
    CA: { currency: "CAD", rate: 1.36 }, // Canada
  };

  return mapping[countryCode] || { currency: "USD", rate: 1 };
};
