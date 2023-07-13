import type { DialogInstance } from "../dialog/types";
import type { GlideInstance } from "../glide/helpers";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Lightbox {
  export type Instance = DialogInstance & {
    show: (data: { img: string; idx: number }) => void;
    slider: GlideInstance;
  };

  export type Hooks = {
    closing?: (lightboxSliderLastIdx: number) => any;
    run?: (lightboxSliderCurrentIdx: number) => any;
  };
}
