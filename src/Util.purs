module Util where

import Prelude
import Data.Int as Int
import Data.Array (zipWith, mapWithIndex)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Web.PointerEvent (PointerEvent)
import Web.PointerEvent.PointerEvent as PE
import Web.UIEvent.MouseEvent as ME
import Web.Event.Event as E
import Web.DOM.Element as Element

map2 ∷ ∀a b c. Array a → Array b → (Int → a → b → c) → Array c
map2 t1 t2 fn = zipWith ($) (mapWithIndex fn t1) t2

map3 ∷ ∀a b c d. Array a → Array b → Array c → (Int → a → b → c → d) → Array d
map3 t1 t2 t3 fn = zipWith ($) (zipWith ($) (mapWithIndex fn t1) t2) t3

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