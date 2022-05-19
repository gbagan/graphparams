module GraphParams.Layout
  ( computeLayout
  ) where

import Prelude
import Data.Array ((..), foldl, mapWithIndex, notElem)
import Data.Foldable (minimum, maximum)
import Data.Int (toNumber)
import Data.Maybe (fromMaybe)
import Data.Number (pi, sqrt, cos, sin)
import GraphParams.Graph (Edge(..), Position)

initialRadius ∷ Number
initialRadius = 10.0

initialAngle ∷ Number
initialAngle = pi * (3.0 - sqrt 5.0)

initLayout ∷ Int → Array Position
initLayout 0 = []

initLayout n =
  0 .. (n - 1)
    <#> \i →
        let
          radius = initialRadius * sqrt (0.5 + toNumber i)
          angle = toNumber i * initialAngle
        in
          { x: radius * cos angle, y: radius * sin angle }

normalize ∷ Array Position → Array Position
normalize layout =
  let
    xmin = fromMaybe 0.0 $ minimum (_.x <$> layout)
    xmax = fromMaybe 0.0 $ maximum (_.x <$> layout)
    ymin = fromMaybe 0.0 $ minimum (_.y <$> layout)
    ymax = fromMaybe 0.0 $ maximum (_.y <$> layout)
  in
    layout
      <#> \{ x, y } → { x: 0.05 + (x - xmin) * 0.9 / (xmax - xmin), y: 0.05 + (y - ymin) * 0.9 / (ymax - ymin) }

step ∷ Array Edge → Array Position → Array Position
step = force 0.05 0.1

force ∷ Number → Number → Array Edge → Array Position → Array Position
force alpha beta edges layout =
  layout
    # mapWithIndex \i { x, y } →
        let
          repulsiveForces =
            layout
              # mapWithIndex \j { x: x', y: y' } →
                  if i == j then
                    { x: 0.0, y: 0.0 }
                  else
                    let
                      dist2 = (x - x') * (x - x') + (y - y') * (y - y')
                      dist = sqrt dist2
                      f = alpha / dist2
                    in
                      { x: f * (x - x') / dist, y: f * (y - y') / dist }

          springForces =
            layout
              # mapWithIndex \j { x: x', y: y' } →
                  if Edge i j `notElem` edges then
                    { x: 0.0, y: 0.0 }
                  else
                    let
                      dist = sqrt $ (x - x') * (x - x') + (y - y') * (y - y')
                      f = beta * (1.0 - dist)
                    in
                      { x: f * (x - x') / dist, y: f * (y - y') / dist }

          forces = repulsiveForces <> springForces
        in
          { x: x + foldl (+) 0.0 (_.x <$> forces), y: y + foldl (+) 0.0 (_.y <$> forces) }

computeLayout ∷ Int → Array Edge → Array Position
computeLayout n edges =
  1 .. 300
    # foldl (\lay _ → step edges lay) (initLayout n)
    # normalize
