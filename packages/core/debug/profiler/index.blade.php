@if ($profiler)
  <script type="module">
    import 'https://cdn.interactjs.io/v1.9.20/auto-start/index.js'
    import 'https://cdn.interactjs.io/v1.9.20/actions/drag/index.js'
    import 'https://cdn.interactjs.io/v1.9.20/actions/resize/index.js'
    import 'https://cdn.interactjs.io/v1.9.20/modifiers/index.js'
    import 'https://cdn.interactjs.io/v1.9.20/dev-tools/index.js'
    import interact from 'https://cdn.interactjs.io/v1.9.20/interactjs/index.js'

    const position = {
      x: 0,
      y: 0
    }
    interact('.debugProfiler')
      .draggable({
        onMove(event) {
          position.x += event.dx
          position.y += event.dy

          event.target.style.transform =
            `translate(${position.x}px, ${position.y}px)`
        },
      })
      .resizable({
        edges: {
          top: true,
          left: true,
          bottom: true,
          right: true
        },
        onMove(event) {
          let {
            x,
            y
          } = event.target.dataset

          x = (parseFloat(x) || 0) + event.deltaRect.left
          y = (parseFloat(y) || 0) + event.deltaRect.top

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
            transform: `translate(${x}px, ${y}px)`
          })

          Object.assign(event.target.dataset, {
            x,
            y
          })
        }
      })
  </script>
  <style>
    .debugProfiler {
      z-index: 99999;
      position: fixed;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, .9);
      color: white;
      padding: 2em 3em;
      font-size: 12px;
      font-family: monospace;
    }

    .debugProfiler ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .debugProfiler li {
      padding-left: 20px;
      padding: 0 0 .5em;
    }

    .debugProfiler details p {
      opacity: .7;
      padding-left: 1em;
    }
  </style>
  <div
    class="debugProfiler"
    draggable
  >
    {!! $profiler !!}
  </div>
@endif
