Alternate Name
==============

> [!important]
>
> This is low effort.
>
> Obsidian's public API generally does not support what this plugin attempts to do, and hacky methods need to be employed to get what little functionality is provided working. I may end up abandoning this plugin and moving to another app if substantial internal API changes are made.
>
> Obsidian: we need to be able to alter view data before it is ever rendered to the UI.

An [Obsidian](https://obsidian.md) plugin for using a note's frontmatter for an alternate name.

Without modifying the original note's name, this plugin will replace every occurrence of the note's file name with an alternate name from the note's frontmatter. This applies to all of the views provided by Obsidian and its core plugins, and may not work with views provided by third-party plugins.

Usage
-----

TODO Installation steps.

By default, the first alias (`aliases.0`) for a note will be used as the alternate title. This can be changed to any value in the frontmatter by using [a valid `delve()` path](https://www.npmjs.com/package/dlv).
