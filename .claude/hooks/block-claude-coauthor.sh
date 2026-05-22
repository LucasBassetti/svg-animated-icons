#!/usr/bin/env bash
# Block git commit / gh pr create|edit when the command body carries a
# Co-Authored-By trailer referencing Claude or anthropic.com. Hook input is
# Claude Code's PreToolUse JSON on stdin; the hook stays silent (exit 0) for
# every command that doesn't match.
set -euo pipefail

jq -r '
  (.tool_input.command // "") as $c |
  if ($c | test("\\b(git commit|gh pr create|gh pr edit)\\b"))
     and ($c | test("Co-Authored-By:[^<>]*<[^<>]*(claude|anthropic\\.com)"; "i"))
  then
    {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: "Co-Authored-By trailer for Claude/anthropic is banned in this repo per user preference. Retry the command without that line."
      }
    }
  else
    empty
  end
'
