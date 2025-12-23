# pars crucis

Pars Crucis roleplaying system for Foundry Virtual Tabletop (http://foundryvtt.com).

### Useful:

To check the language library, type on the console:
**_game.i18n.translations_**
check under PC

To get an actor data by name
game.actors.getName('name')

To get an item data by id
**_game.items.get('\_itemId')_**

### on Handlebars

_{{log actor}}_
Use example, to console.log(actor) in the actor .hbs

### On the Actor class

actor#itemTypes is a good helper to filter items by type

### On Document class

**items#documentsByType** similar to itemTypes but works on every _EmbeddedCollection_
