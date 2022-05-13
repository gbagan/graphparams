module GraphParams.GraphView where

import Prelude

import GraphParams.Model (Model, Edge(..), Graph, Msg(..))
-- import Lib.Graph as Graph
-- import Lib.Update (UpdateMam)
import Pha.Html (Html)
import Pha.Html as H
import Pha.Html.Attributes as P
import Pha.Html.Events as E
import Web.Event.Event (stopPropagation)
import Web.PointerEvent (PointerEvent)
import Web.PointerEvent.PointerEvent as PE

colors :: Array String
colors = ["blue", "red", "green", "cyan", "magenta", "orange", "gray", "black", "yellow"]

data EditMode = VertexMode | AddEMode | DeleteMode | MoveMode
derive instance Eq EditMode

{-
update ∷ ∀st. Lens' st Model → Msg → UpdateMam st
update lens = case _ of
    AddVertex ev → do 
        pos ← liftEffect $ pointerDecoder ev
        case pos of
            Nothing → pure unit
            Just p →
                lens %= \model → 
                    if model.mode == VertexMode then
                        model{graph = Graph.addVertex p model.graph}
                    else
                        model

    SelectVertex i ev → do
        liftEffect $ stopPropagation $ PE.toEvent ev
        lens %= \model →
            if model.mode `elem` [AddEMode, VertexMode] then
                model{selectedVertex = Just i}
            else
                model

    DropOrLeave →
        lens %= \model →
            if model.mode == AddEMode then
                model{selectedVertex = Nothing}
            else  
                model

    PointerUp i → do
        lens %= \model →
            case model.mode, model.selectedVertex of
                VertexMode, _ →
                    model{selectedVertex = Nothing, currentPosition = Nothing}
                AddEMode, Just j →
                    model{graph = Graph.addEdge i j model.graph, selectedVertex = Nothing}
                _, _ → model

    Move ev → do 
        pos ← liftEffect $ pointerDecoder ev
        lens %= \model →
            case pos, model.mode, model.selectedVertex of
                Just p, VertexMode, Just i →
                    model{graph = Graph.moveVertex i p model.graph}
                Just p, AddEMode, _ →
                    model{currentPosition = Just p}
                _, _, _ → model

    DeleteVertex i ev → do
        st ← get
        when ((st^.lens).mode == VertexMode)
            (liftEffect $ stopPropagation $ PE.toEvent ev)
        lens %= \model →
            if model.mode == DeleteMode then
                model{graph = Graph.removeVertex i model.graph}
            else
                model
    
    DeleteEdge (Edge u v) →
        lens %= \model →
            if model.mode == DeleteMode then
                model{graph = Graph.removeEdge u v model.graph}
            else
                model

    SetMode mode → lens %= \model → model{mode = mode}
    Clear → lens %= \model → model{graph = emptyGraph}
-}

currentLine ∷ ∀a. Position → Position → Html a
currentLine p1 p2 =
    H.line
    [   P.x1 $ 100.0 * p1.x
    ,   P.y1 $ 100.0 * p1.y
    ,   P.x2 $ 100.0 * p2.x
    ,   P.y2 $ 100.0 * p2.y
    ,   H.class_ "dessin-line-to-pointer"
    ]

graphView :: Model → Html Msg
graphView {graph, mode, currentPosition, selectedVertex} =
    [   H.div [H.class_ "flex graphparams-graphview"]
        [   H.div [H.class_ "graphparams-graphview-board"]
            [   H.svg [ H.class_ "dessin-svg"
                      , P.viewBox 0 0 100 100
                      , E.onClick $ AddVertex
                      , E.onPointerUp \_ → DropOrLeave
                      , E.onPointerLeave \_ → DropOrLeave
                      , E.onPointerMove $ GraphMove
                      ]
                [   H.g [] $ 
                        graph.edges <#> \edge →
                            H.maybe (getCoordsOfEdge graph edge) \{px1, px2, py1, py2} →
                                H.line 
                                [   P.x1 $ 100.0 * px1
                                ,   P.y1 $ 100.0 * py1
                                ,   P.x2 $ 100.0 * px2
                                ,   P.y2 $ 100.0 * py2
                                ,   H.class_ "ui-grapheditor-edge"
                                ,   H.class' "deletemode" $ mode == DeleteMode
                                ,   E.onClick \_ → geditormsg (DeleteEdge edge)
                                ]
                ,   H.g [] $
                        graph.vertices # mapWithIndex \i {x, y} →
                            H.circle
                            [   P.cx $ 100.0 * x
                            ,   P.cy $ 100.0 * y
                            ,   P.r 3.0
                            ,   H.class_ "ui-grapheditor-vertex"
                            ,   H.class' "deletemode" $ mode == DeleteMode
                            ,   P.stroke $ if selectedVertex == Just i then "red" else "blue"
                            --,   P.fill "blue"
                            ,   E.onClick \ev → geditormsg (DeleteVertex i ev)
                            ,   E.onPointerDown \ev → geditormsg (SelectVertex i ev)
                            ,   E.onPointerUp \_ → geditormsg (PointerUp i)
                            ]
                ,   H.when (mode == AddEMode) \_ →
                        H.fromMaybe case selectedVertex of
                            Just v → currentLine <$> currentPosition <*> (Graph.getCoords graph v)
                            _ → Nothing
                ]
            ]
        ,   H.div [H.class_ "flex graphparams-graphview-buttons"] 
            [   H.button [P.selected: mode == VertexMode, E.onClick \_ -> SetMode VertexMode] [H.text "Add vertex"]
            ,   H.button [P.selected: mode == VertexMode, E.onClick \_ -> SetMode VertexMode] [H.text "Add edge"]
            ,   H.button {icon: IconSymbol "#edge", selected: mode == AddEMode, tooltip: Just "Connecte deux sommets"}
                            [E.onClick \_ → geditormsg $ SetMode AddEMode]
            ,   iconbutton {icon: IconSymbol "#trash", selected: mode == DeleteMode, tooltip: Just "Enlève un sommet ou arête"}
                            [E.onClick \_ → geditormsg $ SetMode DeleteMode]
            ,   iconbutton {icon: IconSymbol "#clear", tooltip: Just "Efface tout le graphe"}  [E.onClick \_ → geditormsg Clear]
            ]
        ]
    ]