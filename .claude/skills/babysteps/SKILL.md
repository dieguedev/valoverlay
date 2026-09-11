---
name: babysteps
description: Replan an implementation plan into truly atomic baby steps instead of big vertical slices. Use whenever the user wants to plan how to start building something, breaks down features, asks "what's step one", or uses phrases like 'baby steps', 'paso a paso', or pushes back that a proposed first step is too big.
---

Stop proposing "vertical slices" that quietly bundle several pieces together end-to-end just because they touch a real user flow. A slice that mixes server + auth + realtime + UI in one step is not small just because it's called "minimal" — it's several steps wearing a trenchcoat.

Think about how a human actually starts building: scaffold one tool, see it run empty, commit. Scaffold the next tool, see it run empty, commit. Only after the pieces individually exist do you pick the next small step that connects two of them.

A baby step is small, not incomplete. What exists after the step must work and be finished for the little it does — never a broken fragment of a bigger feature left half-wired. "It doesn't do anything useful yet" is fine. "It's half-built and would break if you tried to use it" is not.

Each baby step should end at a natural commit boundary, verifiable on its own (it runs, it renders, it responds) without needing the next step to prove it did anything.

When proposing the next step, propose only one. Don't pre-plan the whole staircase — the right next step often only becomes obvious once the current one is done and committed.
