module Util where

import Prelude
import Data.Int as Int
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Web.PointerEvent (PointerEvent)
import Web.PointerEvent.PointerEvent as PE
import Web.UIEvent.MouseEvent as ME
import Web.Event.Event as E
import Web.DOM.Element as Element

pointerDecoder ∷ PointerEvent → Effect (Maybe { x ∷ Number, y ∷ Number })
pointerDecoder ev = do
    case E.currentTarget (PE.toEvent ev) >>= Element.fromEventTarget of
        Just el → do
            let mev = PE.toMouseEvent ev
            {left, top, width, height} ← Element.getBoundingClientRect el
            pure $ Just {
                x: (Int.toNumber(ME.clientX mev) - left) / width,
                y: (Int.toNumber(ME.clientY mev) - top) / height
            }
        _ → pure Nothing