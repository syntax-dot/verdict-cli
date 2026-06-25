#!/usr/bin/env bash
set -euo pipefail

normalize_path() {
  local value="$1"
  if command -v cygpath >/dev/null 2>&1; then
    cygpath -u "$value" 2>/dev/null || printf '%s\n' "$value"
    return
  fi
  printf '%s\n' "$value"
}

write_output() {
  local name="$1"
  local value="$2"
  if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
    printf '%s=%s\n' "$name" "$value" >> "$GITHUB_OUTPUT"
  fi
}

ensure_parent_dir() {
  local target="$1"
  mkdir -p "$(dirname "$target")"
}

append_step_summary() {
  local summary_path="$1"
  if [[ -n "${GITHUB_STEP_SUMMARY:-}" && -f "$summary_path" ]]; then
    cat "$summary_path" >> "$GITHUB_STEP_SUMMARY"
    printf '\n' >> "$GITHUB_STEP_SUMMARY"
  fi
}

write_default_result_outputs() {
  write_output "verdict" "errored"
  write_output "passed" "0"
  write_output "failed" "0"
  write_output "errored" "0"
}

write_result_outputs() {
  local result_path="$1"
  if [[ ! -f "$result_path" ]]; then
    write_output "result-exists" "false"
    write_default_result_outputs
    return
  fi

  write_output "result-exists" "true"
  if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
    "$node_bin" - "$result_path" >> "$GITHUB_OUTPUT" <<'NODE' || write_default_result_outputs
const fs = require("node:fs")

const resultPath = process.argv[2]
const result = JSON.parse(fs.readFileSync(resultPath, "utf8"))
const summary = result.summary ?? {}
const outputs = {
  verdict: typeof summary.verdict === "string" ? summary.verdict : "errored",
  passed: Number.isInteger(summary.passed) ? summary.passed : 0,
  failed: Number.isInteger(summary.failed) ? summary.failed : 0,
  errored: Number.isInteger(summary.errored) ? summary.errored : 0,
}

for (const [name, value] of Object.entries(outputs)) {
  process.stdout.write(`${name}=${value}\n`)
}
NODE
  fi
}

finish_with_outputs() {
  local exit_code="$1"
  local result_path="$2"
  local summary_path="$3"
  write_output "exit-code" "$exit_code"
  write_output "result-path" "$result_path"
  write_output "summary-path" "$summary_path"
  write_result_outputs "$result_path"
}

write_action_error_summary() {
  local summary_path="$1"
  local message="$2"
  ensure_parent_dir "$summary_path"
  {
    printf '## VerdictCI action error\n\n'
    printf '%s\n' "$message"
  } > "$summary_path"
  append_step_summary "$summary_path"
}

action_path="$(normalize_path "${GITHUB_ACTION_PATH:-$(pwd)}")"
workspace="$(normalize_path "${GITHUB_WORKSPACE:-$(pwd)}")"
config_path="${INPUT_CONFIG:-}"
output_path="$(normalize_path "${INPUT_OUTPUT:-verdictci-result.json}")"
summary_path="$(normalize_path "${INPUT_SUMMARY:-verdictci-summary.md}")"
fixture_mode="${INPUT_FIXTURE_MODE:-false}"
fail_on="${INPUT_FAIL_ON:-fail}"
node_bin="${VERDICTCI_NODE:-node}"

if [[ "$fail_on" != "fail" ]]; then
  message="Unsupported fail-on value '${fail_on}'. Milestone 4 supports only 'fail'."
  printf '%s\n' "$message" >&2
  write_action_error_summary "$summary_path" "$message"
  finish_with_outputs "2" "$output_path" "$summary_path"
  exit 0
fi

if [[ -z "$config_path" ]]; then
  message="Missing required config input. Pass config: verdictci.yaml or config: evals.yaml."
  printf '%s\n' "$message" >&2
  write_action_error_summary "$summary_path" "$message"
  finish_with_outputs "2" "$output_path" "$summary_path"
  exit 0
fi

cd "$workspace"

args=(
  "$action_path/node_modules/tsx/dist/cli.mjs"
  "$action_path/packages/cli/src/index.ts"
  "run"
  "--config"
  "$config_path"
  "--output"
  "$output_path"
  "--summary"
  "$summary_path"
)

if [[ "$fixture_mode" == "true" ]]; then
  args+=("--fixture-mode")
fi

set +e
"$node_bin" "${args[@]}"
cli_exit_code="$?"
set -e

append_step_summary "$summary_path"
finish_with_outputs "$cli_exit_code" "$output_path" "$summary_path"
exit 0
