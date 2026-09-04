/**
 * Prototype case records. Frontend-only sample data — no backend is implied.
 * Shape mirrors what a future records API would return.
 */

export type CaseStatus = "Active" | "Reserved" | "Disposed" | "Appeal";

export interface CaseParty {
  role: string;
  name: string;
}

export interface CaseEvent {
  date: string;
  title: string;
  note: string;
}

export interface CaseRecord {
  id: string;
  title: string;
  court: string;
  bench: string;
  status: CaseStatus;
  filed: string;
  updated: string;
  parties: CaseParty[];
  subject: string;
  history: CaseEvent[];
  summary: string;
  issues: string[];
  authorities: string[];
  /** Restricted matter — shown with the confidential treatment across the app. */
  confidential?: boolean;
  /** Quick-access matters, surfaced in the sidebar. */
  pinned?: boolean;
  /** Completed matters retained for reference. Not deleted. */
  archived?: boolean;
}

export const CASES: CaseRecord[] = [
  {
    id: "CIV-2024-0417",
    title: "Marwah Textiles Pvt. Ltd. v. Union Bank",
    court: "High Court of Delhi",
    bench: "Division Bench II",
    status: "Active",
    filed: "12 Mar 2024",
    updated: "2 days ago",
    subject: "Commercial · Recovery & Security Interest",
    parties: [
      { role: "Petitioner", name: "Marwah Textiles Pvt. Ltd." },
      { role: "Respondent", name: "Union Bank, Commercial Branch" },
      { role: "Counsel", name: "S. Iyer, Sr. Adv." },
    ],
    history: [
      { date: "12 Mar 2024", title: "Petition filed", note: "Challenge to classification of the loan account." },
      { date: "04 Apr 2024", title: "Notice issued", note: "Respondent directed to file counter within four weeks." },
      { date: "19 Jun 2024", title: "Interim protection", note: "Coercive recovery stayed subject to deposit." },
      { date: "27 Aug 2024", title: "Arguments part-heard", note: "On the scope of the security agreement." },
    ],
    summary:
      "A commercial dispute over whether the bank could enforce security before exhausting the contractual cure period. The petitioner deposited part of the claimed amount and secured interim protection; the surviving question is the construction of clause 14 of the facility agreement.",
    issues: [
      "Whether the cure period under clause 14 is a condition precedent to enforcement",
      "Whether classification of the account was procedurally valid",
      "Extent of interim protection pending final adjudication",
    ],
    authorities: ["Mardia Chemicals v. Union of India", "ICICI Bank v. Official Liquidator"],
  },
  {
    id: "CRL-2023-1188",
    title: "State v. Rehman & Others",
    court: "Sessions Court, Bengaluru",
    bench: "Court No. 7",
    status: "Reserved",
    filed: "08 Sep 2023",
    updated: "6 days ago",
    subject: "Criminal · Documentary Evidence",
    parties: [
      { role: "Prosecution", name: "State of Karnataka" },
      { role: "Accused", name: "A. Rehman and two others" },
      { role: "Counsel", name: "N. Prakash, Adv." },
    ],
    history: [
      { date: "08 Sep 2023", title: "Charge sheet filed", note: "Three accused named; documents relied upon listed." },
      { date: "21 Nov 2023", title: "Charges framed", note: "Plea of not guilty recorded." },
      { date: "14 May 2024", title: "Prosecution evidence closed", note: "Eleven witnesses examined." },
      { date: "02 Aug 2024", title: "Judgment reserved", note: "Written submissions taken on record." },
    ],
    summary:
      "Prosecution rests substantially on documentary material whose chain of custody was contested during cross-examination. Judgment stands reserved after written submissions on admissibility.",
    issues: [
      "Admissibility of the seized ledger under the certificate requirement",
      "Effect of gaps in the chain of custody",
      "Individual attribution of liability among the three accused",
    ],
    authorities: ["Anvar P.V. v. P.K. Basheer", "Arjun Panditrao Khotkar v. Kailash Gorantyal"],
  },
  {
    id: "CON-2022-0093",
    title: "Nagra v. Municipal Corporation",
    court: "Supreme Court",
    bench: "Bench of Three Judges",
    status: "Appeal",
    filed: "22 Jan 2022",
    updated: "3 weeks ago",
    subject: "Constitutional · Land Acquisition",
    parties: [
      { role: "Appellant", name: "H. Nagra" },
      { role: "Respondent", name: "Municipal Corporation" },
      { role: "Intervenor", name: "Residents' Welfare Association" },
    ],
    history: [
      { date: "22 Jan 2022", title: "Special leave petition", note: "Against the High Court judgment of Nov 2021." },
      { date: "17 Mar 2022", title: "Leave granted", note: "Appeal admitted; status quo directed." },
      { date: "09 Feb 2023", title: "Intervention allowed", note: "Association permitted to assist the Court." },
      { date: "11 Jul 2024", title: "Listed for final hearing", note: "Compilation of records directed." },
    ],
    summary:
      "Appeal concerning compensation and the procedural validity of an acquisition notification. The Court has preserved status quo and directed a consolidated record ahead of final hearing.",
    issues: [
      "Validity of the notification for want of a hearing",
      "Applicable date for determining market value",
      "Whether the lapse provision is attracted on these facts",
    ],
    authorities: ["Indore Development Authority v. Manoharlal", "Pune Municipal Corp. v. Harakchand Solanki"],
  },
  {
    id: "FAM-2024-0602",
    title: "In re: Estate of D. Kaul",
    court: "District Court, Pune",
    bench: "Court No. 3",
    status: "Disposed",
    filed: "30 Apr 2024",
    updated: "5 weeks ago",
    subject: "Succession · Testamentary",
    parties: [
      { role: "Applicant", name: "R. Kaul" },
      { role: "Caveator", name: "M. Kaul" },
    ],
    history: [
      { date: "30 Apr 2024", title: "Probate petition", note: "Will dated 2019 propounded." },
      { date: "18 Jun 2024", title: "Caveat filed", note: "Execution of the will disputed." },
      { date: "26 Sep 2024", title: "Consent terms", note: "Parties settled; petition disposed of." },
    ],
    summary:
      "Testamentary proceeding resolved on consent terms recorded between the propounder and the caveator, with the estate divided by agreement rather than adjudication.",
    issues: ["Due execution and attestation of the 2019 will", "Effect of the consent terms on residual claims"],
    authorities: ["H. Venkatachala Iyengar v. B.N. Thimmajamma"],
  },
];
