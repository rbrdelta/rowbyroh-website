You are auditing one rowbyroh content page against Daniel's voice fingerprint.

Read the voice fingerprint (provided below) and the page prose (provided below).
Score the prose against the 8-dimension rubric and the red lines.

CRITICAL CONSTRAINTS:
- Daniel-verbatim prose is ground truth. If a passage is clearly Daniel's own
  writing (first-person reflection, his essays, his "Me" turns in a roundtable),
  do NOT flag it for voice — only flag Claude-generated connective/wrapper prose.
- Be conservative. Only flag a CONFIRMED failure you can quote and explain.
  Under uncertainty, do not flag. False positives erode trust in the gate.
- Every proposed fix must be SUBTRACTIVE or a verbatim-preserving rephrase —
  never add prose, never invent containers, never insert slogans.

Return ONLY a JSON object, no prose around it:
{
  "page": "<url or filename>",
  "verdict": "pass" | "fail",
  "fails": [
    {"dimension": "Rhythm|Voice|...", "quote": "<offending text>", "why": "<one line>", "fix": "<subtractive proposal>"}
  ],
  "notes": "<one line summary>"
}
