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
    pinned: true,
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
    confidential: true,
    pinned: true,
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
    archived: true,
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
  },,
{
    id: "ARB-2025-0031",
    title: "Sable Infra LLP v. Coastal Port Authority",
    court: "Arbitral Tribunal, Mumbai",
    bench: "Three-member tribunal",
    status: "Active",
    filed: "09 Jan 2025",
    updated: "yesterday",
    subject: "Arbitration · Concession Agreement",
    confidential: true,
    parties: [
      { role: "Claimant", name: "Sable Infra LLP" },
      { role: "Respondent", name: "Coastal Port Authority" },
      { role: "Counsel", name: "S. Iyer, Sr. Adv." },
    ],
    history: [
      { date: "09 Jan 2025", title: "Statement of claim", note: "Termination of the concession disputed." },
      { date: "26 Feb 2025", title: "Procedural order 1", note: "Confidentiality regime recorded by consent." },
    ],
    summary:
      "A confidential arbitration over the termination of a port concession. The tribunal has recorded a confidentiality regime, so the record is restricted to counsel on file.",
    issues: ["Whether termination followed the contractual cure procedure", "Quantification of the claimant's sunk cost"],
    authorities: ["Associate Builders v. DDA"],
  },
  {
    id: "TAX-2023-0774",
    title: "Verma Exports v. Commissioner of Customs",
    court: "CESTAT, Chennai",
    bench: "Single Member",
    status: "Disposed",
    filed: "17 Feb 2023",
    updated: "4 months ago",
    subject: "Indirect Tax · Classification",
    archived: true,
    parties: [
      { role: "Appellant", name: "Verma Exports" },
      { role: "Respondent", name: "Commissioner of Customs" },
    ],
    history: [
      { date: "17 Feb 2023", title: "Appeal filed", note: "Against the order-in-original on classification." },
      { date: "05 Dec 2024", title: "Appeal allowed", note: "Classification restored to the declared heading." },
    ],
    summary:
      "Classification dispute closed in the appellant's favour; retained in the archive as the reasoning governs later consignments.",
    issues: ["Correct tariff heading for the imported assembly"],
    authorities: ["Dunlop India v. Union of India"],
  },
  {
    id: "IPR-2024-0250",
    title: "Aureus Labs v. Kestrel Pharma",
    court: "High Court of Bombay",
    bench: "Single Judge (IP Division)",
    status: "Active",
    filed: "22 Aug 2024",
    updated: "9 days ago",
    subject: "Intellectual Property · Patent Infringement",
    parties: [
      { role: "Plaintiff", name: "Aureus Labs Pvt. Ltd." },
      { role: "Defendant", name: "Kestrel Pharma Ltd." },
    ],
    history: [
      { date: "22 Aug 2024", title: "Suit filed", note: "Interim injunction sought against the generic launch." },
      { date: "30 Oct 2024", title: "Ad-interim order", note: "Defendant to maintain accounts pending hearing." },
    ],
    summary:
      "Patent infringement suit concerning a generic formulation; the live question is the credibility of the invalidity challenge at the interim stage.",
    issues: ["Prima facie validity of the suit patent", "Balance of convenience on a pre-launch injunction"],
    authorities: ["F. Hoffmann-La Roche v. Cipla"],
  },
];
