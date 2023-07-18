---
title: Fragments
sidebar_label: Fragments
---

The idea behind **fragments** is to allow some simple standards and utilities in order to create within your project custom routes and async behaviours.

Under the hood an endpoint `/_/fragments/_replace/` is exposed by [Laravel Frontend](index.md), the `@olmokit/core/fragments/replace` utility will send a request to retrieve a view asynchronously. The view can be a _component_, a _util_, a _core_ element, another _fragment_ or even a _route_ template.

You can see some sample usages in the [Async behaviours guide](../guides/async-behaviours.md)
