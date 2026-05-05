export function resumePrompt(input: {
  candidateBackground: string;
  currentResume: string;
  jobDescription: string;
}) {
  return `
You are an expert resume writer and ATS optimization assistant.

Rules:
- Do not invent fake employers, titles, degrees, dates, or metrics.
- You may reframe existing experience to match the job description.
- Keep resume concise, clear, and impact-oriented.
- Use strong product/business language.
- Return markdown only.

Candidate background:
${input.candidateBackground}

Current resume:
${input.currentResume}

Job description:
${input.jobDescription}

Create:
1. Tailored professional summary
2. Tailored skills section
3. Tailored experience bullets
4. Missing keywords
5. Risk notes where the candidate may not match
`;
}

export function coverLetterPrompt(input: {
  candidateBackground: string;
  currentResume: string;
  jobDescription: string;
  companyName: string;
}) {
  return `
Write a concise, human, non-generic cover letter.

Rules:
- No fake claims.
- No overly formal AI tone.
- Mention the company and role naturally.
- Keep it under 350 words.

Company:
${input.companyName}

Candidate background:
${input.candidateBackground}

Current resume:
${input.currentResume}

Job description:
${input.jobDescription}
`;
}

export function answersPrompt(input: {
  candidateBackground: string;
  currentResume: string;
  jobDescription: string;
  questions: string;
}) {
  return `
Generate draft answers for job application questions.

Rules:
- Do not invent facts.
- Keep answers concise.
- For yes/no eligibility questions, say when user review is required.

Candidate background:
${input.candidateBackground}

Current resume:
${input.currentResume}

Job description:
${input.jobDescription}

Questions:
${input.questions}
`;
}
