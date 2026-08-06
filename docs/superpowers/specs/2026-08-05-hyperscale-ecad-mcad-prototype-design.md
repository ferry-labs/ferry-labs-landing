# Hyperscale Power ECAD–MCAD Bridge Prototype

## Purpose

Create a polished, public prototype that follows the August 5 discussion with Daniel Rothmund. The prototype should earn an introduction to Hyperscale Power's design engineer by demonstrating that Ferry understood the specific Altium Designer–Autodesk Inventor iteration problem.

The prototype is a product concept built with simulated data. It must not imply that Ferry has accessed Hyperscale Power designs, completed either product integration, or proven measured customer outcomes.

## Audience and desired action

The primary audience is Daniel, followed by the engineer to whom he may forward the link. The single desired action is to review the workflow with Ferry in a short engineering session.

## Product concept

The prototype presents an end-to-end **ECAD–MCAD Live Bridge** for a representative solid-state transformer power module:

1. Detect a PCB revision in Altium Designer.
2. Synchronize the board and component geometry into an Autodesk Inventor cabinet assembly.
3. Evaluate the updated assembly against mechanical design constraints.
4. Explain the affected parts and highlight conflicts in the model.
5. Translate an Inventor-side constraint into a proposed PCB change.
6. Require an engineer to review before sending the proposal back to Altium.
7. Preserve the revision, source, constraints, and decision in a change record.

The prototype does not assume that existing ECAD–MCAD products solve or fail to solve Hyperscale Power's workflow. It demonstrates the outcome Ferry would investigate and asks the engineer to validate the missing pieces.

## Experience

The visualization is the prototype. The page removes the separate editorial briefing, dense CAD-style workspace, and repeated Ferry-method section in favor of one interactive system canvas that answers four questions in a single view:

1. What changed in Altium?
2. Where does Ferry sit between the systems?
3. Which agents act on the change, and what does each one do?
4. What mechanical impact and engineer-controlled return change result?

The canvas places **Altium Designer** on the left, the **Ferry Unified Engineering Context Layer** in the center, and **Autodesk Inventor** on the right. Ferry must be the visual and conceptual center of the system—not a thin arrow or generic automation label.

The Altium source begins with revision C.14 and the three changes that trigger the workflow:

- DC-link capacitor bank moved 18 mm;
- gate-driver connector J17 rotated 90 degrees;
- mounting hole H4 shifted 6 mm.

Each source change remains selectable and traceable through its full path:

`source change → mapped object → applicable constraint → measured impact → proposed resolution`

The named working agents are:

1. **Altium Change Agent:** captures the revision-level change set and provenance.
2. **Context Mapping Agent:** links Altium objects to corresponding Inventor geometry and relevant constraints.
3. **Inventor Assembly Agent:** stages the mapped geometry update in the mechanical assembly context.
4. **Constraint & Impact Agent:** evaluates explicit clearance, service-access, and alignment rules.
5. **Review & Return Agent:** assembles a source-native return proposal and routes it through engineer approval.

The context layer visibly accumulates five kinds of structured context as the workflow runs: object identities, revision changes, geometry mappings, design constraints, and decisions with provenance.

The user has one primary action, `Run design coordination`. The system progresses through the five agents, visually marking the active agent and adding context records. The resulting impact view preserves the existing simulated findings:

- capacitor move → cold-plate relationship → 4.2 mm interference;
- connector rotation → service-access envelope → 8 mm available vs. 15 mm required;
- H4 shift → cabinet standoff axis → 6 mm misalignment.

The Review & Return Agent produces a proposed Altium change set. The engineer explicitly approves or rejects it; nothing writes to a source design automatically. After approval, Ferry adds the decision and revision lineage to the context layer.

The canvas concludes with one restrained outcome statement and the existing review CTA. It must be understandable before interaction, while the animated run demonstrates how the system behaves.

## Interface design

The visual direction is precise European industrial systems architecture, not a generic AI dashboard:

- warm off-white canvas, graphite typography, restrained signal colors;
- compact technical labels and tabular numerals;
- thin rules, deliberate spacing, and almost no decorative shadows;
- no gradients, glass effects, oversized pills, chat interface, sparkle iconography, or generic AI copy;
- a bespoke CSS-authored system canvas with directional rails, structured change packets, agent states, context records, and a compact mechanical-impact model;
- Ferry branding is quiet and secondary to the engineering workflow.

The page uses a restrained black-and-brass palette, consistent one-pixel rules, compact agent-status treatments, and editorially concise copy. Agents are named system workers, not characters: no avatars, robot illustrations, chat bubbles, sparkles, or anthropomorphic animation.

Desktop presents the source system, Ferry layer, and target system on one horizontal architecture canvas, with agents arranged along the data path. Mobile stacks the same system vertically in source-to-context-to-target order and preserves the trace from each source change to its result.

## Simulated scenario

The Altium revision contains three changes:

- DC-link capacitor bank moved 18 mm toward the cold plate;
- gate-driver connector rotated 90 degrees;
- PCB mounting hole H4 shifted 6 mm.

After synchronization, the system reports:

- a 4.2 mm cold-plate interference caused by the capacitor move;
- only 8 mm of service access at the rotated connector against a 15 mm internal design constraint;
- mounting hole H4 no longer aligned with the cabinet standoff.

The proposed return change moves the capacitor bank 7 mm, restores connector access, and repositions H4 to the linked Inventor reference. These values are illustrative and will be labeled simulated.

## Technical approach

The first version is a self-contained static experience using semantic HTML, CSS, and JavaScript. No customer files, authentication, database, or external APIs are required. State changes are deterministic and resettable.

It will live under the existing Ferry Labs website as a discrete prototype page, reuse the site's production deployment path, and avoid changing existing pages or global behavior.

## Quality and verification

Verification covers:

- full interaction from ready state through engineer approval;
- reset behavior;
- no broken links or JavaScript errors;
- desktop and mobile rendering;
- clear simulated-data disclosure;
- keyboard-accessible buttons and visible focus states;
- copy review for unsupported claims and AI clichés.
- explicit coverage of the two source systems, Ferry context layer, five named agents, three triggering changes, mapped constraints, measured impacts, return proposal, and engineer approval;
- absence of the removed `HSP-SST / Power Module A` label.

## Follow-up email

The email will be brief and peer-to-peer. It will thank Daniel, link the prototype, explain that it models the workflow he described rather than claiming a finished integration, and ask for a 30-minute review with the relevant engineer. It will not pitch certification work or describe the related space prototype as a completed case study.
