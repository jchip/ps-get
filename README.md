# ps-get

Get running processes through `ps`.

- Support getting a tree of children that belong to a parent
- Platforms
  - Unix: uses `ps`
  - Windows: try to use `wmic` and then `powershell`

<https://github.com/jchip/ps-get>

## APIs

API references can be found [here](https://jchip.github.io/ps-get/modules/index.html)

Or just use your IDE for hint if it supports TypeScript and typedoc.

## Examples

```js
import { ps, psChildren } from "ps-get";

async function test() {
  const procs = await ps();
}

async function testChildren() {
  const children = await psChildren(1);
}
```

## Why

There are already quite a few modules like this that has millions of weekly downloads, so why another one?

- `ps-tree` - `event-stream`, bug, no activity.
- `ps-list` - no API to get children, me not a fan of embedding `.exe`, even if it's 5x faster.
- others - I didn't do enough searching.

# License

Licensed under the [Apache License, Version 2.0].

[apache license, version 2.0]: https://www.apache.org/licenses/LICENSE-2.0
