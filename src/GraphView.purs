module GraphParams.GraphView where

import Prelude

import Data.Array ((..), any, elem, length, replicate, updateAtIndices)
import Data.Maybe (Maybe(..))
import Data.Tuple.Nested ((/\))
import GraphParams.Graph as Graph
import GraphParams.Model (Model, Position, EditMode(..), Witness(..))
import GraphParams.Msg (Msg(..))
import Pha.Html (Html)
import Pha.Html as H
import Pha.Html.Attributes as P
import Pha.Html.Events as E
import Util (map2)

currentLine ∷ ∀ a. Position → Position → Html a
currentLine p1 p2 =
  H.line
    [ P.x1 $ 100.0 * p1.x
    , P.y1 $ 100.0 * p1.y
    , P.x2 $ 100.0 * p2.x
    , P.y2 $ 100.0 * p2.y
    , H.class_ "graphparams-graphview-edge pointer-events-none"
    ]

graphView ∷ Model → Html Msg
graphView { graph: graph@{ layout, edges }, witness, editmode, currentPosition, selectedVertex, isComputing } =
  let
    vertexColor = case witness of
      SetWitness set →
        replicate (length layout) 0
          # updateAtIndices ((_ /\ 1) <$> set)
      ColorWitness col → col
      EdgeWitness wedges →
        0 .. (length layout - 1)
          <#> \v →
              if any (Graph.incident v) wedges then 1 else 0
      _ → replicate (length layout) 0

    selectedEdges = case witness of
      EdgeWitness wedges -> wedges
      _ -> []

  in
    H.div []
      [ H.div [ H.class_ "graphparams-graphview-board" ]
          [ H.svg
              [ H.class_ "display-block"
              , P.viewBox 0 0 100 100
              , E.onClick $ AddVertex
              , E.onPointerUp \_ → DropOrLeave
              , E.onPointerLeave \_ → DropOrLeave
              , E.onPointerMove $ GraphMove
              ]
              [ H.g []
                  $ edges
                  <#> \edge →
                      H.maybe (Graph.getCoordsOfEdge graph edge) \{ x1, x2, y1, y2 } →
                        H.line
                          [ P.x1 $ 100.0 * x1
                          , P.y1 $ 100.0 * y1
                          , P.x2 $ 100.0 * x2
                          , P.y2 $ 100.0 * y2
                          , H.class_ "graphparams-graphview-edge"
                          , H.class' "color1" $ edge `elem` selectedEdges
                          , H.class' "deletemode" $ editmode == DeleteMode
                          , E.onClick \_ → DeleteEdge edge
                          ]
              , H.g []
                  $ map2 layout vertexColor \i { x, y } color →
                      H.circle
                        [ P.cx $ 100.0 * x
                        , P.cy $ 100.0 * y
                        , P.r 2.3
                        , H.class_ $ "graphparams-graphview-vertex color" <> show color
                        , H.class' "deletemode" $ editmode == DeleteMode
                        -- , P.stroke $ if selectedVertex == Just i then "red" else "blue"
                        --,   P.fill "blue"
                        , E.onClick \ev → DeleteVertex i ev
                        , E.onPointerDown \ev → SelectVertex i ev
                        , E.onPointerUp \_ → PointerUp i
                        ]
              , H.g []
                  case witness of
                    OrderWitness order ->
                      map2 layout order \_ {x, y} o ->
                        H.text_ (show $ o + 1) [H.class_ "graphview-text", P.x (100.0 * x), P.y (100.0 * y)]
                    _ -> []

              , H.when (editmode == AddEMode) \_ →
                  H.fromMaybe case selectedVertex of
                    Just v → currentLine <$> currentPosition <*> Graph.getCoords graph v
                    _ → Nothing
              ]
          ]
      , H.elem "sl-button-group" []
          [ H.elem "sl-button" [ P.disabled isComputing, P.selected $ editmode == MoveMode, E.onClick \_ → SetEditMode MoveMode ] [ H.text "Move" ]
          , H.elem "sl-button" [ P.disabled isComputing, P.selected $ editmode == VertexMode, E.onClick \_ → SetEditMode VertexMode ] [ H.text "Add vertex" ]
          , H.elem "sl-button" [ P.disabled isComputing, P.selected $ editmode == AddEMode, E.onClick \_ → SetEditMode AddEMode ] [ H.text "Add edge" ]
          , H.elem "sl-button" [ P.disabled isComputing, P.selected $ editmode == DeleteMode, E.onClick \_ → SetEditMode DeleteMode ] [ H.text "Remove" ]
          , H.elem "sl-button" [ P.disabled isComputing, E.onClick \_ → ClearGraph ] [ H.text "Clear" ]
          , H.elem "sl-button" [ P.disabled isComputing, E.onClick \_ → AdjustGraph ] [ H.text "Adjust" ]
          ]
      ]
