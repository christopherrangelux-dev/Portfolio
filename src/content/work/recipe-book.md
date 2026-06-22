---
name: "Recipe Book"
title: "Recipe Book: Rebuilding an Early Project With Everything I Know Now"
subtitle: "Rebuilding an early coding project with everything I know now: same recipes, same voice, entirely different architecture."
order: 6
featured: false
tags: ["Personal Project", "Content Architecture", "Astro", "Design Systems"]
snapshot:
  role: "Designer & Developer"
  timeline: "June 2026"
  tools: "Astro, VS Code, Claude Code"
  team: "Solo"
metric: "2022 → 2026"
metricLabel: "rebuilt from scratch"
color: "#8b5e3c"
pattern: lattice
---

## The Problem

In 2022, I built a recipe site as an early coding project: HTML files, w3.css, externally hosted
images, one page per recipe. It worked. It's still live. But it was built the way someone learning
to code builds things: get it working, ship it, move on. The content was genuine, recipes my
partner and I actually cook, with the memories that came with them, but the architecture was
whatever got it online that day.

## The Process

**[Browse the recipes →](/recipes)**

Early projects are worth revisiting not because they're bad, but because the gap between then and
now is visible. The HTML is fine. The recipes are good. What's missing is everything underneath: a
content model, a design system, a way to add a new recipe without copying and editing another file
by hand.

## The Decision

Keep everything that made the original worth making. Rebuild everything else.

**What stayed:**
- All 12 recipes, with their original stories intact
- The personal voice; these are not SEO-optimized recipe cards
- The YouTube embeds where they exist

**What changed:**
- HTML files became an Astro content collection with a typed schema
- w3.css became this portfolio's existing design system
- Externally hosted images became local assets
- One-file-per-recipe navigation became a proper index with category filtering
- No information architecture became organized categories: baked goods, savory, soups, pasta

The schema does the same job here that it does for the case studies above: one typed shape that
every recipe has to follow, so adding the thirteenth recipe later is a matter of writing a file,
not inventing a new pattern.

## The Outcome

- A living recipe collection that adds a new entry the same way the portfolio adds a new case study
- 12 recipes migrated with their original personal notes preserved, not rewritten
- One content model shared across two very different kinds of work: enterprise case studies and family recipes

## Reflection

This one's a reminder that "the gap between then and now" isn't really about HTML versus a
framework. It's that I didn't have a way to think about content as a system in 2022, and I do now.
The recipes didn't need fixing. I did.
