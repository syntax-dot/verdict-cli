import { access, readFile } from "node:fs/promises"
import path from "node:path"

const requiredPaths = [
  "AGENTS.md",
  "README.md",
  "docs/demo/design-partner-feedback.md",
  "docs/demo/public-demo.md",
  "docs/agentic/project-skills.md",
  "docs/product/brief.md",
  "docs/scope/mvp.md",
  "docs/architecture/overview.md",
  "docs/specs/cli.md",
  "docs/specs/config-yaml.md",
  "docs/specs/result-json.md",
  "docs/specs/exit-codes.md",
  "docs/implementation/roadmap.md",
  "docs/qa/acceptance-criteria.md",
]

const requiredReadmeLinks = [
  "docs/demo/public-demo.md",
  "docs/product/brief.md",
  "docs/scope/mvp.md",
  "docs/architecture/overview.md",
  "docs/implementation/roadmap.md",
  "docs/qa/acceptance-criteria.md",
  "docs/agentic/project-skills.md",
]

const missingPaths = []

for (const relativePath of requiredPaths) {
  try {
    await access(path.resolve(relativePath))
  } catch {
    missingPaths.push(relativePath)
  }
}

const readme = await readFile("README.md", "utf8")
const missingReadmeLinks = requiredReadmeLinks.filter((link) => !readme.includes(link))
const requiredDemoPhrases = [
  "Passing PR",
  "Failing PR",
  "GitHub Actions",
  "docs/demo/design-partner-feedback.md",
  "verdictci-result.json",
  "examples/support-bot/verdictci-pass.yaml",
  "examples/support-bot/verdictci-fail.yaml",
]
const requiredFeedbackPhrases = [
  "Conversation metadata",
  "Fit check",
  "Problem evidence",
  "Demo reproduction",
  "Product signals",
  "Private notes location",
]
let missingDemoPhrases = []
let missingFeedbackPhrases = []

try {
  const demo = await readFile("docs/demo/public-demo.md", "utf8")
  missingDemoPhrases = requiredDemoPhrases.filter((phrase) => !demo.includes(phrase))
} catch {
  missingDemoPhrases = requiredDemoPhrases
}

try {
  const feedback = await readFile("docs/demo/design-partner-feedback.md", "utf8")
  missingFeedbackPhrases = requiredFeedbackPhrases.filter((phrase) => !feedback.includes(phrase))
} catch {
  missingFeedbackPhrases = requiredFeedbackPhrases
}

if (
  missingPaths.length > 0 ||
  missingReadmeLinks.length > 0 ||
  missingDemoPhrases.length > 0 ||
  missingFeedbackPhrases.length > 0
) {
  if (missingPaths.length > 0) {
    console.error(`Missing required docs: ${missingPaths.join(", ")}`)
  }
  if (missingReadmeLinks.length > 0) {
    console.error(`README.md is missing links: ${missingReadmeLinks.join(", ")}`)
  }
  if (missingDemoPhrases.length > 0) {
    console.error(`Public demo guide is missing phrases: ${missingDemoPhrases.join(", ")}`)
  }
  if (missingFeedbackPhrases.length > 0) {
    console.error(
      `Design partner feedback template is missing phrases: ${missingFeedbackPhrases.join(", ")}`,
    )
  }
  process.exitCode = 1
}
