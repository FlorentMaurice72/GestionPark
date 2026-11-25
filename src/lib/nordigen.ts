const BASE = "https://bankaccountdata.gocardless.com/api/v2";

export interface Institution {
  id: string;
  name: string;
  bic: string;
  transaction_total_days: string;
  countries: string[];
  logo: string;
}

export interface Requisition {
  id: string;
  created: string;
  redirect: string;
  status: string;
  institution_id: string;
  accounts: string[];
  link: string;
  reference: string;
}

export interface NordigenTransaction {
  transactionId?: string;
  internalTransactionId?: string;
  bookingDate: string;
  transactionAmount: { amount: string; currency: string };
  remittanceInformationUnstructured?: string;
  remittanceInformationUnstructuredArray?: string[];
  creditorName?: string;
  debtorName?: string;
}

async function getToken(): Promise<string> {
  const res = await fetch(`${BASE}/token/new/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      secret_id: process.env.NORDIGEN_SECRET_ID,
      secret_key: process.env.NORDIGEN_SECRET_KEY,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Nordigen auth failed: ${res.status} — ${text}`);
  }
  const data = (await res.json()) as { access: string };
  return data.access;
}

export async function getInstitutions(country = "FR"): Promise<Institution[]> {
  const token = await getToken();
  const res = await fetch(`${BASE}/institutions/?country=${country}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Nordigen institutions: ${res.status}`);
  return res.json() as Promise<Institution[]>;
}

export async function createRequisition(params: {
  institutionId: string;
  redirectUrl: string;
  reference: string;
}): Promise<Requisition> {
  const token = await getToken();
  const res = await fetch(`${BASE}/requisitions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      redirect: params.redirectUrl,
      institution_id: params.institutionId,
      reference: params.reference,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Nordigen create requisition: ${res.status} — ${text}`);
  }
  return res.json() as Promise<Requisition>;
}

export async function getRequisition(requisitionId: string): Promise<Requisition> {
  const token = await getToken();
  const res = await fetch(`${BASE}/requisitions/${requisitionId}/`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Nordigen get requisition: ${res.status}`);
  return res.json() as Promise<Requisition>;
}

export async function getAccountTransactions(
  accountId: string,
  dateFrom?: string,
): Promise<{ booked: NordigenTransaction[]; pending: NordigenTransaction[] }> {
  const token = await getToken();
  const qs = dateFrom ? `?date_from=${dateFrom}` : "";
  const res = await fetch(`${BASE}/accounts/${accountId}/transactions/${qs}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Nordigen transactions: ${res.status}`);
  const data = (await res.json()) as {
    transactions: { booked: NordigenTransaction[]; pending: NordigenTransaction[] };
  };
  return data.transactions;
}

export function extractTransactionId(tx: NordigenTransaction): string {
  return (
    tx.transactionId ??
    tx.internalTransactionId ??
    `${tx.bookingDate}-${tx.transactionAmount.amount}`
  );
}

export function extractLibelle(tx: NordigenTransaction): string {
  if (tx.remittanceInformationUnstructured) return tx.remittanceInformationUnstructured;
  if (tx.remittanceInformationUnstructuredArray?.length) {
    return tx.remittanceInformationUnstructuredArray.join(" ");
  }
  return tx.creditorName ?? tx.debtorName ?? "Virement";
}
