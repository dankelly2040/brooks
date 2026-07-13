# Brooks Mobile Commerce Prototype

Brooks is an exploration of what a best-in-class native shopping experience for
Brooks Running could feel like.

The repository will contain two apps:

- **Expo app:** the primary deliverable—an exceptionally polished iOS and
  Android experience targeting Expo SDK 57 and Expo Go, with web support where
  practical.
- **Exact app:** an experimental companion implementation used to push Exact's
  current capabilities and document what works, what is difficult, and what
  should improve.

## Product scope

The apps will combine native mobile-commerce patterns with the visual character
and content of the Brooks Running website. They will use real Brooks website
data and observed APIs for product discovery, product details, variants, and a
working add-to-cart journey.

Completing checkout, submitting payment, and placing an order are out of scope.

## Design goal

The Expo app should be more than a functional port of a website. It should feel
distinctively native, refined, responsive, and compelling enough to demonstrate
to Brooks executives why Expo is a strong foundation for their mobile app
experience.

Its design direction will blend:

1. patterns identified in a survey of excellent mobile shoe-shopping apps; and
2. the layout, brand language, content, and spirit of the Brooks website.

## Building as research

Most of the project will be implemented by AI agents. Agents will keep concise,
durable development diaries describing successful approaches, blockers,
unexpected difficulty, comparative friction, and ideas for improving Expo and
Exact. Diaries should record useful evidence and retrospectives—not secrets or
private hidden reasoning.

## Project documentation

The project uses [Linked Literate Programming](https://github.com/ccheever/llp)
to keep code connected to design rationale.

- [LLP 0000: Brooks](./llp/0000-brooks.explainer.md) is the product and system
  entry point.
- [AGENTS.md](./AGENTS.md) contains working instructions for AI agents.

Implementation has not been scaffolded yet. The open product, API, design, and
diary-format decisions are tracked in LLP 0000.
