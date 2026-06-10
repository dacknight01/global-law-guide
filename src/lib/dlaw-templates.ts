// Library of common legal document templates.
// Neutral, informational starters — not legal advice.

export interface TemplateSection {
  heading: string;
  body: string;
}

export interface LegalTemplate {
  slug: string;
  title: string;
  category: string;
  summary: string;
  whenToUse: string;
  sections: TemplateSection[];
  notes: string[];
  // Prefill for the chat composer when a user asks D-Law AI to tailor it.
  prompt: string;
}

export const TEMPLATES: LegalTemplate[] = [
  {
    slug: "immigration-recommendation-letter",
    title: "Immigration Recommendation Letter",
    category: "Immigration Law",
    summary:
      "A character or professional reference letter supporting an applicant's visa, residency, or naturalization application.",
    whenToUse:
      "Use when a friend, colleague, employer, or community member asks you to vouch for an applicant's character, employment, or contributions in support of an immigration petition.",
    sections: [
      {
        heading: "1. Sender header",
        body:
          "Full legal name, address, phone, email, and date. If writing in a professional capacity, include your title and organization.",
      },
      {
        heading: "2. Recipient & subject line",
        body:
          'Address the relevant authority (e.g. "To Whom It May Concern" or the consulate / USCIS officer if known). Subject: "Letter of Recommendation for [Applicant Full Name] – [Visa / Petition Type]".',
      },
      {
        heading: "3. Introduction",
        body:
          "State who you are, how long you have known the applicant, and in what capacity (employer, colleague, mentor, friend). Briefly state the purpose: that you are writing in support of their application.",
      },
      {
        heading: "4. Body — character & contributions",
        body:
          "Describe the applicant's character, skills, achievements, or community contributions with specific, verifiable examples. Tie each example to qualities relevant to the petition (good moral character, exceptional ability, family ties, employability).",
      },
      {
        heading: "5. Recommendation statement",
        body:
          "Clearly state that you recommend the applicant for the visa, residency, or status they are seeking, and that you believe they will be an asset to the host country.",
      },
      {
        heading: "6. Closing & signature",
        body:
          'Offer to be contacted for verification, sign by hand if submitted on paper, and print your name and title beneath. Add: "I declare under penalty of perjury that the foregoing is true and correct" where required by the jurisdiction.',
      },
    ],
    notes: [
      "Keep the letter to one page where possible.",
      "Attach proof of your own status (ID, work authorization) if requested by the immigration authority.",
      "Translation: if the letter is not in an official language of the receiving country, attach a certified translation.",
    ],
    prompt:
      "Draft an immigration recommendation letter for [applicant name], applying for [visa / status] in [country]. I have known them for [duration] as their [relationship]. Highlight: [achievements / character traits].",
  },
  {
    slug: "contract-termination-letter",
    title: "Contract Termination Letter",
    category: "Contract Law",
    summary:
      "A formal notice ending a contractual relationship — service agreements, vendor contracts, or commercial leases.",
    whenToUse:
      "Use to end a contract with a vendor, service provider, contractor, or business partner in writing, with a clear effective date and reference to the termination clause.",
    sections: [
      {
        heading: "1. Sender & recipient header",
        body: "Your name / company, address, date, and the recipient's name, title, and address.",
      },
      {
        heading: "2. Subject line",
        body: 'Subject: "Notice of Termination — [Contract Title], dated [Contract Date]".',
      },
      {
        heading: "3. Reference to the contract",
        body:
          "Identify the contract by title, date, and any reference number. Quote or cite the clause that governs termination (e.g. notice period, termination for convenience, termination for cause).",
      },
      {
        heading: "4. Termination statement",
        body:
          'State clearly: "This letter serves as formal notice that [Party] is terminating the Contract effective [date]." Specify whether termination is for convenience or for cause; if for cause, briefly state the breach.',
      },
      {
        heading: "5. Wind-down obligations",
        body:
          "Set out final deliverables, outstanding invoices, return of confidential information or property, and any survival clauses (confidentiality, IP, non-compete) that continue after termination.",
      },
      {
        heading: "6. Closing & signature",
        body:
          "Request written acknowledgement of receipt, provide a contact for transition matters, and sign with name and title.",
      },
    ],
    notes: [
      "Check the contract's notice period and delivery method (registered mail, email to a designated address) before sending.",
      "Keep proof of delivery (recorded delivery receipt, email read receipt) for evidentiary purposes.",
      "If the contract is governed by a foreign jurisdiction, local mandatory rules on termination notice may override the contract.",
    ],
    prompt:
      "Draft a contract termination letter to [counterparty] for the [contract title] dated [contract date], governed by the laws of [country]. Termination is for [convenience / cause: brief reason], effective [date].",
  },
  {
    slug: "employment-termination-letter",
    title: "Employment Termination Letter",
    category: "Employment Law",
    summary:
      "A written notice from an employer ending an employee's contract, or from an employee resigning from a role.",
    whenToUse:
      "Use to document the end of an employment relationship with a clear effective date, reason where required, and reference to notice or severance terms.",
    sections: [
      {
        heading: "1. Header",
        body: "Employer / employee name and address, date, and reference number.",
      },
      {
        heading: "2. Subject line",
        body: 'Subject: "Notice of Termination of Employment" or "Notice of Resignation".',
      },
      {
        heading: "3. Statement of termination",
        body:
          "State clearly that the employment relationship is being terminated, the last working day, and whether the employee is required to work the notice period or is being placed on garden leave / paid in lieu of notice.",
      },
      {
        heading: "4. Reason (where required)",
        body:
          "Many jurisdictions require a stated reason for employer-initiated termination (e.g. redundancy, performance, misconduct). Resignation letters typically do not need a reason.",
      },
      {
        heading: "5. Final pay & benefits",
        body:
          "Outline final salary, accrued holiday pay, severance / redundancy entitlements, pension, and continuation of benefits such as health insurance where applicable.",
      },
      {
        heading: "6. Return of property & confidentiality",
        body:
          "List company property to be returned and remind the recipient of surviving obligations (confidentiality, non-solicitation, IP assignment).",
      },
      {
        heading: "7. Signature & acknowledgement",
        body: "Signed by an authorised signatory; request signed acknowledgement of receipt.",
      },
    ],
    notes: [
      "Statutory minimum notice and protected reasons (pregnancy, union activity, whistleblowing) vary widely — check local labour law before issuing.",
      "Some jurisdictions require consultation, severance, or works-council involvement before termination is effective.",
    ],
    prompt:
      "Draft an employment termination letter for an employee in [country], role [job title], with [years] years of service. Reason: [redundancy / performance / resignation]. Notice period under their contract is [period].",
  },
  {
    slug: "non-disclosure-agreement",
    title: "Non-Disclosure Agreement (NDA)",
    category: "Contract Law",
    summary:
      "A mutual or one-way agreement to keep specified information confidential when sharing it between parties.",
    whenToUse:
      "Use before sharing trade secrets, financials, product plans, or customer data with a potential partner, investor, contractor, or employee.",
    sections: [
      { heading: "1. Parties & date", body: "Full legal names, registered addresses, and effective date." },
      {
        heading: "2. Purpose",
        body:
          'Define the permitted purpose narrowly (e.g. "evaluating a possible commercial partnership relating to X").',
      },
      {
        heading: "3. Definition of Confidential Information",
        body:
          "Include written, oral, and electronic information, marked or reasonably understood as confidential, and any derivative material.",
      },
      {
        heading: "4. Obligations",
        body:
          "Use the information only for the purpose, restrict access on a need-to-know basis, apply at least the same protections as the recipient uses for its own confidential information, and prohibit reverse engineering.",
      },
      {
        heading: "5. Exclusions",
        body:
          "Standard carve-outs: information already public, lawfully received from a third party, independently developed, or required to be disclosed by law / court order (with prior notice where possible).",
      },
      {
        heading: "6. Term & return of materials",
        body:
          "Set a confidentiality term (commonly 2–5 years; indefinite for trade secrets) and require return or destruction of materials on request.",
      },
      {
        heading: "7. Remedies, governing law & signatures",
        body:
          "Acknowledge that damages may be inadequate and that injunctive relief is available; set governing law and venue; sign by authorised representatives.",
      },
    ],
    notes: [
      "Trade-secret regimes (e.g. EU Trade Secrets Directive, US Defend Trade Secrets Act) may give additional protection beyond contract.",
      "Mutual vs one-way: use mutual where both sides will share confidential information.",
    ],
    prompt:
      "Draft a [mutual / one-way] NDA between [Party A] and [Party B] governed by the laws of [country], for the purpose of [evaluating partnership / employment / investment].",
  },
  {
    slug: "residential-lease-agreement",
    title: "Residential Lease Agreement",
    category: "Property & Real Estate Law",
    summary:
      "A contract between a landlord and tenant for the rental of a residential property.",
    whenToUse:
      "Use to formalise the rental terms of an apartment or house, including rent, deposit, term, and the rights and obligations of each party.",
    sections: [
      { heading: "1. Parties & property", body: "Landlord and tenant details, plus the full address of the rented property." },
      {
        heading: "2. Term",
        body: "Fixed-term, periodic (month-to-month), or indefinite; start and end dates; renewal mechanism.",
      },
      {
        heading: "3. Rent & deposit",
        body:
          "Monthly rent, due date, payment method, late fees, and the security deposit (subject to statutory caps in many jurisdictions).",
      },
      {
        heading: "4. Utilities & charges",
        body: "Allocation of utilities, service charges, internet, and any homeowners' association fees.",
      },
      {
        heading: "5. Use, maintenance & repairs",
        body:
          "Permitted use (residential only), tenant maintenance duties, landlord repair obligations, and access for inspections (with notice).",
      },
      {
        heading: "6. Termination & notice",
        body: "Notice period for either side, early-termination clauses, and grounds for landlord termination.",
      },
      {
        heading: "7. Signatures",
        body: "Signed by all parties; some jurisdictions require notarisation or registration with a housing authority.",
      },
    ],
    notes: [
      "Many countries have mandatory tenant-protection rules (rent caps, eviction grounds, deposit schemes) that override contractual terms.",
      "Furnished vs unfurnished leases may have different tax and tenancy regimes.",
    ],
    prompt:
      "Draft a residential lease for a property in [city, country], starting [date], for [term length], at [rent] per month with a [amount] deposit. Furnished: [yes/no].",
  },
  {
    slug: "last-will-and-testament",
    title: "Last Will and Testament (Outline)",
    category: "Family Law",
    summary:
      "A document directing how a person's estate should be distributed after death and who should administer it.",
    whenToUse:
      "Use to record your wishes for distribution of assets, guardianship of minor children, and appointment of an executor. Formal validity rules vary widely — always verify locally.",
    sections: [
      { heading: "1. Declaration", body: 'State full name, address, that you are of sound mind, and that this is your "Last Will and Testament", revoking all prior wills.' },
      { heading: "2. Family & dependants", body: "Identify spouse / civil partner, children, and other dependants." },
      {
        heading: "3. Executor & alternate",
        body: "Appoint one or more executors and a backup; consider a professional executor for complex estates.",
      },
      {
        heading: "4. Specific gifts",
        body: "List specific items or sums of money and the named beneficiary for each.",
      },
      {
        heading: "5. Residuary estate",
        body: "Direct who receives the remainder of the estate after debts, taxes, and specific gifts.",
      },
      {
        heading: "6. Guardianship",
        body: "Name a guardian (and alternate) for minor children.",
      },
      {
        heading: "7. Execution formalities",
        body:
          "Sign in the presence of the required number of witnesses (commonly two adults who are not beneficiaries); have witnesses sign and add their addresses. Some jurisdictions require notarisation or registration.",
      },
    ],
    notes: [
      "Forced-heirship rules (common in civil-law jurisdictions) restrict how much of an estate can be left freely.",
      "Cross-border estates may engage the EU Succession Regulation, treaties, or conflict-of-laws rules.",
      "Holographic (handwritten) wills are valid in some jurisdictions and invalid in others.",
    ],
    prompt:
      "Draft an outline last will and testament for a resident of [country], with [number] children, primary assets [list], naming [name] as executor.",
  },
  {
    slug: "power-of-attorney",
    title: "Power of Attorney",
    category: "Family Law",
    summary:
      "A document authorising another person to act on your behalf in financial, legal, or healthcare matters.",
    whenToUse:
      "Use when you need someone else to sign documents, manage finances, or make decisions for you — temporarily, during travel or illness, or on a continuing basis.",
    sections: [
      { heading: "1. Principal & agent", body: "Full legal names and addresses of the person granting authority (principal) and the person receiving it (agent / attorney-in-fact)." },
      {
        heading: "2. Scope of authority",
        body:
          "Choose general (broad) or specific (limited to listed acts: sell a property, manage a bank account, sign a tax return).",
      },
      {
        heading: "3. Duration",
        body:
          "State start date and either an end date or that it continues until revoked. A durable power of attorney remains effective if the principal becomes incapacitated; a springing one only activates on incapacity.",
      },
      {
        heading: "4. Limits & instructions",
        body: "Exclude gifts to the agent, set transaction limits, or require co-signature for large decisions.",
      },
      {
        heading: "5. Revocation",
        body: "Explain how the principal can revoke (written notice to the agent and to relevant institutions).",
      },
      {
        heading: "6. Execution",
        body:
          "Sign in front of a notary or the locally required witnesses. Healthcare and real-estate powers often have stricter formalities.",
      },
    ],
    notes: [
      "Cross-border use may require apostille (Hague Convention) or consular legalisation.",
      "Banks and registries often require their own templates — check before signing a generic form.",
    ],
    prompt:
      "Draft a [general / specific / durable] power of attorney governed by the laws of [country], from [principal] to [agent], for the purpose of [scope].",
  },
  {
    slug: "gdpr-data-processing-agreement",
    title: "GDPR Data Processing Agreement (DPA)",
    category: "Data Privacy Law",
    summary:
      "A contract between a data controller and a processor required by Article 28 of the EU/UK GDPR when personal data is processed on the controller's behalf.",
    whenToUse:
      "Use when you engage a vendor (cloud provider, payroll service, marketing tool) to process personal data of EU/UK individuals on your behalf.",
    sections: [
      { heading: "1. Parties & subject matter", body: "Identify controller and processor and the underlying main services agreement." },
      {
        heading: "2. Details of processing",
        body:
          "Specify duration, nature and purpose of processing, categories of personal data, and categories of data subjects (usually in an annex).",
      },
      {
        heading: "3. Processor obligations",
        body:
          "Process only on documented instructions; ensure confidentiality of personnel; implement appropriate technical and organisational measures (Art. 32); assist the controller with data-subject rights and breach notification.",
      },
      {
        heading: "4. Sub-processors",
        body:
          "Set out general or specific authorisation, prior-notice procedure for changes, and flow-down of equivalent obligations.",
      },
      {
        heading: "5. International transfers",
        body:
          "Where data leaves the EEA / UK, incorporate Standard Contractual Clauses (SCCs) or the UK IDTA / Addendum, and complete a transfer impact assessment where required.",
      },
      {
        heading: "6. Audit, deletion & liability",
        body:
          "Audit rights, return or deletion of personal data at end of services, and allocation of liability for fines and claims.",
      },
    ],
    notes: [
      "The EU Commission's 2021 SCCs and the UK IDTA / Addendum are the practical mechanisms for international transfers after Schrems II.",
      "Equivalent regimes (e.g. UAE PDPL, KSA PDPL, Brazil LGPD, California CPRA) require their own contractual mechanisms.",
    ],
    prompt:
      "Draft a GDPR Article 28 Data Processing Agreement between [controller] and [processor] for the processing of [data categories] in connection with [service]. Sub-processors: [yes/no]. International transfers: [yes/no, region].",
  },
];

export function getTemplate(slug: string) {
  return TEMPLATES.find((t) => t.slug === slug);
}
