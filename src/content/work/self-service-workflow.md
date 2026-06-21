---
name: "Self-Service Workflow"
title: "Self-Service Workflow: From 53% to 96% Completion"
subtitle: "Rebuilding a confusing multi-touch credential request process into one guided change-order flow — completion scaled from 53% to 96%."
thumbnail: "self-service-change-order.png"
order: 2
featured: true
tags: ["Workflow Design", "Developer Tooling", "Self-Service UX"]
snapshot:
  role: "Product Designer"
  timeline: "Aug 2024–Present"
  tools: "Figma, FigJam, React (recreation)"
  team: "Solo design, cross-functional engineering partners"
---

## The Problem

Self-service completion for API, app, and entitlement access requests was stuck at 53%. It wasn't
one clean failure point — manual back-and-forth with asset owners, unclear ownership on requests,
and a slow, confusing flow were all compounding on each other. Developers who needed access
couldn't reliably get through the process on their own.

## The Process

**[Explore the live, interactive demo →](https://christopherrangelux-dev.github.io/nexus-ops/)**
*A representative recreation, genericized and rebuilt in React — not the real internal tool.*

The work started with a full content and component inventory audit — going through the existing
flow screen by screen to identify what could be cut and what needed to be made clearer before
redesigning anything.

## The Decision

Of all the tangled problems, the flow itself was the one piece fully within design's control —
and the lever most likely to unblock everything else. So that's where the redesign focused:
rebuilding the request process around a single change-order pattern. Select the asset, a side
panel opens with a dropdown of the available metadata changes, add any additional fields the
change needs, then submit and get confirmation. What had been a confusing, multi-touch process
became one guided path.

![The change-order side panel — select a change type, fill in just the fields it needs, submit (representative recreation)](/images/self-service-change-order.png)

## The Outcome

- Self-service completion scaled from 53% to 96%
- 100% owner attribution on requests
- Manual support tickets cut 25% via self-service UI configuration

## Reflection

This case study is a good example of why "redesign the screen" and "redesign the flow" are
different jobs. The original screens were reasonable individually; the problem was how many of
them you had to cross, in what order, with how much ambiguity about who owned what. Fixing that
meant collapsing steps, not polishing them.
