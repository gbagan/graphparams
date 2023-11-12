module GraphParams.GraphView where

import Relude

import GraphParams.Graph as Graph
import GraphParams.Model (Model, Position, EditMode(..), Certificate(..))
import GraphParams.Msg (Msg(..))
import GraphParams.UI as UI
import Pha.Html (Html)
import Pha.Html as H
import Pha.Html.Attributes as P
import Pha.Html.Events as E
import Pha.Svg as S
import Pha.Svg.Attributes as SA
import Util (map2)

currentLine ∷ ∀ a. Position → Position → Html a
currentLine p1 p2 =
  S.line
    [ SA.x1 $ 100.0 * p1.x
    , SA.y1 $ 100.0 * p1.y
    , SA.x2 $ 100.0 * p2.x
    , SA.y2 $ 100.0 * p2.y
    , H.class_ "graphparams-graphview-edge pointer-events-none"
    ]

graphView ∷ Model → Html Msg
graphView { graph: graph@{ layout, edges }, certificate, editmode, currentPosition, selectedVertex, isComputing } =
  let
    vertexColor = case certificate of
      Certificate set _ →
        replicate (length layout) 0
          # updateAtIndices ((_ /\ 1) <$> set)
      ColorCertificate col → col
      _ → replicate (length layout) 0

    selectedEdges = case certificate of
      Certificate _ cedges -> cedges
      _ -> []

  in
    H.div []
      [ H.div [ H.class_ "graphparams-graphview-board" ]
          [ S.svg
              [ H.class_ "block"
              , SA.viewBox 0.0 0.0 100.0 100.0
              , E.onClick $ AddVertex
              , E.onPointerUp \_ → DropOrLeave
              , E.onPointerLeave \_ → DropOrLeave
              , E.onPointerMove $ GraphMove
              ]
              [ S.g []
                  $ edges
                  <#> \edge →
                      H.maybe (Graph.getCoordsOfEdge graph edge) \{ x1, x2, y1, y2 } →
                        S.line
                          [ SA.x1 $ 100.0 * x1
                          , SA.y1 $ 100.0 * y1
                          , SA.x2 $ 100.0 * x2
                          , SA.y2 $ 100.0 * y2
                          , H.class_ "graphparams-graphview-edge"
                          , H.class' "color1" $ edge `elem` selectedEdges
                          , H.class' "deletemode" $ editmode == DeleteMode
                          , E.onClick \_ → DeleteEdge edge
                          ]
              , S.g []
                  $ map2 layout vertexColor \i { x, y } color →
                      S.circle
                        [ SA.cx $ 100.0 * x
                        , SA.cy $ 100.0 * y
                        , SA.r 2.3
                        , H.class_ $ "graphparams-graphview-vertex color" <> show color
                        , H.class' "deletemode" $ editmode == DeleteMode
                        , E.onClick (DeleteVertex i)
                        , E.onPointerDown (SelectVertex i)
                        , E.onPointerUp \_ → PointerUp i
                        ]
              , S.g []
                  case certificate of
                    OrderCertificate order ->
                      map2 layout order \_ {x, y} o ->
                        S.text [H.class_ "graphview-text", SA.x (100.0 * x), SA.y (100.0 * y)] [ H.text $ show $ o + 1 ]
                    _ -> []

              , H.when (editmode == AddEMode) \_ →
                  H.fromMaybe case selectedVertex of
                    Just v → currentLine <$> currentPosition <*> Graph.getCoords graph v
                    _ → Nothing
              ]
          ]
      , UI.buttonGroup
          [ { name: "Move", onClick: SetEditMode MoveMode, attrs: [P.disabled isComputing, P.selected $ editmode == MoveMode] }
          , { name: "Add vertex", onClick: SetEditMode VertexMode, attrs: [ P.disabled isComputing, P.selected $ editmode == VertexMode ] }
          , { name: "Add edge", onClick: SetEditMode AddEMode, attrs: [ P.disabled isComputing, P.selected $ editmode == AddEMode ] } 
          , { name: "Remove", onClick: SetEditMode DeleteMode, attrs: [ P.disabled isComputing, P.selected $ editmode == DeleteMode] }
          , { name: "Clear", onClick: ClearGraph, attrs: [ P.disabled isComputing ] }
          , { name: "Adjust", onClick: AdjustGraph, attrs: [ P.disabled isComputing ] }
          ]
      ]
