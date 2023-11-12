module Util where

import Relude
import Data.Int as Int
import Web.UIEvent.MouseEvent (MouseEvent)
import Web.UIEvent.MouseEvent as ME
import Web.PointerEvent (PointerEvent)
import Web.PointerEvent.PointerEvent as PE
import Web.Event.Event as E
import Web.DOM.Element as Element

map2 ∷ ∀a b c. Array a → Array b → (Int → a → b → c) → Array c
map2 t1 t2 fn = zipWith ($) (mapWithIndex fn t1) t2

map3 ∷ ∀a b c d. Array a → Array b → Array c → (Int → a → b → c → d) → Array d
map3 t1 t2 t3 fn = zipWith ($) (zipWith ($) (mapWithIndex fn t1) t2) t3

pointerDecoder ∷ MouseEvent → Effect (Maybe { x ∷ Number, y ∷ Number })
pointerDecoder ev = do
  case E.currentTarget (ME.toEvent ev) >>= Element.fromEventTarget of
    Just el → do
      {left, top, width, height} ← Element.getBoundingClientRect el
      pure $ Just {
        x: (Int.toNumber(ME.clientX ev) - left) / width,
        y: (Int.toNumber(ME.clientY ev) - top) / height
      }
    _ → pure Nothing

pointerDecoder' ∷ PointerEvent → Effect (Maybe { x ∷ Number, y ∷ Number })
pointerDecoder' = pointerDecoder <<< PE.toMouseEvent