export interface Source {
  id: string;
  title: string;
  page: string;
  excerpt: string;
  confidence: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  timestamp: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export const mockChats: Chat[] = [
  {
    id: "chat-1",
    title: "Symptoms of Malaria",
    createdAt: "2026-06-23T10:00:00Z",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "What are the early symptoms of malaria?",
        timestamp: "2026-06-23T10:00:00Z",
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "Malaria symptoms typically appear 10–15 days after the infective mosquito bite. The early symptoms of malaria can be mild and may resemble a common flu or viral infection, making early diagnosis challenging.\n\n**Common early symptoms include:**\n\n- **Fever** — Often cyclical, occurring every 48–72 hours depending on the Plasmodium species\n- **Chills and rigors** — Intense shaking chills that precede the fever\n- **Sweating** — Profuse sweating as the fever breaks\n- **Headache** — Often severe and persistent\n- **Muscle pain and fatigue** — Generalized body aches and malaise\n- **Nausea and vomiting** — Gastrointestinal symptoms are common\n- **Diarrhea** — May occur in some patients\n\n**Important clinical note:** In areas where malaria is not common, these symptoms may be mistaken for influenza. If a patient has traveled to a malaria-endemic region, malaria should be considered in the differential diagnosis even if symptoms appear mild.",
        sources: [
          {
            id: "src-1",
            title: "Gale Encyclopedia of Medicine",
            page: "Vol. 4, pp. 2348–2355",
            excerpt:
              "The classic presentation of malaria consists of paroxysms of fever with chills, rigors, and diaphoresis occurring at regular intervals...",
            confidence: 97,
          },
          {
            id: "src-2",
            title: "WHO Clinical Guidelines",
            page: "Chapter 7, Section 7.2",
            excerpt:
              "Uncomplicated malaria is diagnosed when symptoms are present with a positive parasitological test but with no features of severe malaria...",
            confidence: 95,
          },
          {
            id: "src-3",
            title: "Harrison's Principles of Internal Medicine",
            page: "20th Ed., pp. 1575–1589",
            excerpt:
              "The incubation period for P. falciparum malaria is approximately 12 days, and for P. vivax and P. ovale, approximately 14 days...",
            confidence: 93,
          },
        ],
        timestamp: "2026-06-23T10:00:05Z",
      },
      {
        id: "msg-3",
        role: "user",
        content:
          "How is malaria diagnosed? What tests are commonly used?",
        timestamp: "2026-06-23T10:01:00Z",
      },
      {
        id: "msg-4",
        role: "assistant",
        content:
          "Malaria diagnosis relies on both clinical assessment and laboratory confirmation. Prompt and accurate diagnosis is critical because delayed treatment of *P. falciparum* malaria can lead to severe complications and death.\n\n**Laboratory Diagnostic Methods:**\n\n1. **Microscopy (Gold Standard)**\n   - Thick blood smear — Used for detecting the presence of parasites\n   - Thin blood smear — Used for species identification and parasitemia quantification\n   - Sensitivity: can detect as few as 5–10 parasites per μL of blood\n\n2. **Rapid Diagnostic Tests (RDTs)**\n   - Immunochromatographic tests detecting parasite antigens\n   - Results available in 15–20 minutes\n   - Most detect HRP2 (P. falciparum) or pLDH (all species)\n   - Useful in resource-limited settings\n\n3. **Molecular Methods (PCR)**\n   - Highest sensitivity and specificity\n   - Can detect sub-microscopic infections\n   - Used primarily in research and reference laboratories\n\n**Clinical diagnosis** alone (without laboratory confirmation) is not recommended by WHO due to the non-specific nature of malaria symptoms.",
        sources: [
          {
            id: "src-4",
            title: "WHO Malaria Diagnostic Guidelines",
            page: "2023 Edition, pp. 12–28",
            excerpt:
              "Parasitological confirmation by microscopy or RDT is recommended in all patients with suspected malaria before treatment is started...",
            confidence: 98,
          },
          {
            id: "src-5",
            title: "Clinical Microbiology Reviews",
            page: "Vol. 35, No. 1, e00138-21",
            excerpt:
              "RDTs have transformed malaria diagnosis in endemic areas, providing point-of-care results with sensitivities exceeding 95% for P. falciparum...",
            confidence: 94,
          },
        ],
        timestamp: "2026-06-23T10:01:08Z",
      },
    ],
  },
  {
    id: "chat-2",
    title: "Can Diabetes Be Reversed",
    createdAt: "2026-06-22T14:00:00Z",
    messages: [
      {
        id: "msg-5",
        role: "user",
        content: "Can type 2 diabetes be reversed through diet and exercise?",
        timestamp: "2026-06-22T14:00:00Z",
      },
      {
        id: "msg-6",
        role: "assistant",
        content:
          'The concept of "reversing" type 2 diabetes has gained significant attention in recent medical literature. While the term "reversal" is debated, substantial evidence supports that **diabetes remission** is achievable in certain patients through intensive lifestyle interventions.\n\n**Key Evidence:**\n\n- The **DiRECT Trial** (2018) demonstrated that 46% of participants achieved diabetes remission at 12 months through a structured weight management program\n- Weight loss of **≥15 kg** was associated with remission rates of 86%\n- Early intervention (within 6 years of diagnosis) showed the highest success rates\n\n**Mechanisms:**\n\n- Weight loss reduces ectopic fat in the liver and pancreas\n- Restoration of first-phase insulin secretion\n- Improved peripheral insulin sensitivity\n- Reduction in hepatic glucose output\n\n**Important caveats:**\n\n- Remission is not the same as cure — the underlying genetic predisposition remains\n- Sustained lifestyle changes are required to maintain remission\n- Not all patients respond equally — beta cell function must be partially preserved\n- Patients should continue monitoring and medical follow-up',
        sources: [
          {
            id: "src-6",
            title: "The Lancet - DiRECT Trial",
            page: "Vol. 391, pp. 541–551",
            excerpt:
              "At 12 months, almost half of participants in the intervention group achieved remission to a non-diabetic state...",
            confidence: 96,
          },
          {
            id: "src-7",
            title: "Diabetes Care - ADA Position Statement",
            page: "Vol. 45, Supplement 1",
            excerpt:
              "A consensus report defines remission as HbA1c <6.5% measured at least 3 months after cessation of glucose-lowering therapy...",
            confidence: 94,
          },
        ],
        timestamp: "2026-06-22T14:00:06Z",
      },
    ],
  },
  {
    id: "chat-3",
    title: "Symptoms of Tuberculosis",
    createdAt: "2026-06-21T09:00:00Z",
    messages: [
      {
        id: "msg-7",
        role: "user",
        content: "What are the primary symptoms of tuberculosis?",
        timestamp: "2026-06-21T09:00:00Z",
      },
      {
        id: "msg-8",
        role: "assistant",
        content:
          "Tuberculosis (TB) is caused by *Mycobacterium tuberculosis* and primarily affects the lungs (pulmonary TB), though it can involve any organ system (extrapulmonary TB).\n\n**Classic Pulmonary TB Symptoms:**\n\n- **Persistent cough** lasting ≥2–3 weeks — the hallmark symptom\n- **Hemoptysis** — coughing up blood or blood-tinged sputum\n- **Night sweats** — often drenching, occurring for weeks\n- **Weight loss** — progressive and unexplained\n- **Low-grade fever** — typically in the afternoon\n- **Fatigue and malaise** — chronic generalized weakness\n- **Chest pain** — may indicate pleural involvement\n- **Decreased appetite** — contributing to weight loss\n\n**Red flags requiring urgent evaluation:**\n- Hemoptysis in any amount\n- Symptoms persisting beyond 2 weeks\n- Known contact with TB patient\n- Immunosuppressed individuals (HIV, immunosuppressive therapy)\n\nIt is important to note that latent TB infection is asymptomatic — active disease must be confirmed through sputum testing, chest radiography, and microbiological culture.",
        sources: [
          {
            id: "src-8",
            title: "WHO Global Tuberculosis Report",
            page: "2024 Edition, Chapter 3",
            excerpt:
              "The most common symptom of pulmonary TB is a productive cough lasting more than two weeks, often accompanied by systemic symptoms...",
            confidence: 97,
          },
        ],
        timestamp: "2026-06-21T09:00:07Z",
      },
    ],
  },
];
