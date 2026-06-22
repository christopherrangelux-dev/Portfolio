---
name: "API Governance"
title: "API Governance: Surfacing Evidence, Not Just Verdicts"
subtitle: "Cutting platform debt 25% by pairing dormant-API evidence with a clear action path across an 11,000-endpoint platform."
order: 3
tags: ["Platform Governance", "Data Trust", "Developer Tooling"]
snapshot:
  role: "Product Designer"
  timeline: "2024–Present"
  tools: "Figma, FigJam, React (recreation)"
  team: "Solo design, cross-functional engineering & data partners"
metric: "25%"
metricLabel: "platform debt reduction"
color: "#5c5347"
pattern: dot-matrix
---

## The Problem

The platform had grown to roughly 11,000 API endpoints, and nobody had a reliable way to tell
which ones were still in use. Dormant endpoints accumulated quietly: nothing forced teams to
know about them, let alone act, so the platform kept carrying technical debt no one could see
clearly enough to remove.

## The Process

**[Explore the live, interactive demo →](https://christopherrangelux-dev.github.io/nexus-ops/)**
*The same platform as the Self-Service Workflow case study, viewed through a governance lens: the
API catalog's data-sensitivity classification and the approvals dashboard's risk scoring are the
same "surface the evidence" thinking this case study is about.*

Generating a dormancy verdict for each endpoint wasn't the hard part. Usage data already existed.
The hard part was getting teams to trust the verdict enough to actually act on it.

## The Decision

Two things made that trust possible. First, surfacing the underlying evidence behind each dormant
flag, so a team could see *why* an endpoint was being called out instead of taking a verdict on
faith. Second, pairing that evidence with a clear, simple action path, so finding out an endpoint
was dormant and doing something about it weren't two disconnected steps.

![Evidence behind an access decision: scopes, risk level, and policy context surfaced together, not just a verdict (representative recreation)](/images/api-governance-evidence.png)

## The Outcome

- Dormant/inactive endpoints reduced ~25% (11,000 → ~8,000)
- Manual support tickets cut 25% via self-service UI configuration
- API Coach asset cycle time reduced 10%, accelerating time-to-market

## Reflection

Of the enterprise case studies here, this is the most data-heavy: the interesting design problem
wasn't the UI, it was figuring out what evidence actually builds trust, versus what just produces
another dashboard nobody acts on.
