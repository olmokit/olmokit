---
title: scroll
---

## Scrolling animations

Best option is to use `GSAP` (which we often use anyway) with its official scrolling plugin [`ScrollTrigger`](https://greensock.com/docs/v3/Plugins/ScrollTrigger).

That should replace almost completely [`ScrollMagic`](http://scrollmagic.io/), whose integration with `GSAP` is explained in [this guide](https://greensock.com/scrollmagic/) or our custom implementations with vanilla [`ScrollTrigger`](https://github.com/terwanerik/ScrollTrigger) (still useful for when not needing GSAP) and [`AOS - Animate on scroll`](https://michalsnik.github.io/aos/) (whose ease of use still values).
