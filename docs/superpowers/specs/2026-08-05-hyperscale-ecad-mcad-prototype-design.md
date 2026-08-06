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

The page opens directly into a working project named `HSP-SST / Power Module A`, comparing PCB revision C.14 with cabinet assembly revision M.08.

The experience has four states:

1. **Ready:** A compact change summary identifies three Altium changes waiting to be synchronized.
2. **Synchronizing:** A short progress sequence shows design extraction, geometry alignment, and constraint evaluation.
3. **Review:** The cabinet visualization highlights one hard conflict and one advisory finding. The details show the exact source change, measured impact, and affected mechanical constraint.
4. **Proposed return change:** The user can create and approve a suggested PCB adjustment for Altium. The approval is visibly human-controlled.

The final panel invites Daniel to review the workflow with his design engineer.

## Interface design

The visual direction is precise European industrial software, not a generic AI dashboard:

- warm off-white canvas, graphite typography, restrained signal colors;
- compact technical labels and tabular numerals;
- thin rules, deliberate spacing, and almost no decorative shadows;
- no gradients, glass effects, oversized pills, chat interface, sparkle iconography, or generic AI copy;
- a bespoke CSS-authored cutaway of the cabinet and PCB, with dimensional annotations and highlighted change geometry;
- Ferry branding is quiet and secondary to the engineering workflow.

Desktop uses a three-region workspace: revision context, visual assembly, and impact review. Mobile stacks the same regions without removing the core interaction.

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

## Follow-up email

The email will be brief and peer-to-peer. It will thank Daniel, link the prototype, explain that it models the workflow he described rather than claiming a finished integration, and ask for a 30-minute review with the relevant engineer. It will not pitch certification work or describe the related space prototype as a completed case study.
