module GraphParams.Model where

import Prelude
import Data.Array (elem)
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Web.PointerEvent (PointerEvent)
import Web.PointerEvent.PointerEvent as PE
import Web.Event.Event (stopPropagation)
import GraphParams.Graph (Graph, Edge(..))
import GraphParams.Graph as Graph
import Pha.Update (Update, modify_)
import Util (pointerDecoder)


data EditMode = VertexMode | AddEMode | DeleteMode
derive instance Eq EditMode

type Position = { x :: Number, y :: Number}

type Model =
    {   witness :: Witness
    ,   isComputing :: Boolean
    ,   code :: String
    ,   error :: Maybe String
    ,   parameters :: Array Parameter
    ,   graph ∷ Graph
    ,   editmode ∷ EditMode
    ,   selectedVertex ∷ Maybe Int
    ,   currentPosition ∷ Maybe Position
    }

init :: Model
init =
    {   witness: NoWitness
    ,   isComputing: false
    ,   code: "blah blah"
    ,   error: Nothing
    ,   parameters: []
    ,   graph: {layout: [], edges: []}
    ,   editmode: VertexMode
    ,   selectedVertex: Nothing
    ,   currentPosition: Nothing
    }

type Parameter =
    {   result :: Maybe Result
    ,   fullname :: String
    }

type Result =
    {   value :: String
    ,   witness :: Witness
    }

data Witness = NoWitness | ColorWitness (Array Int) | SetWitness (Array Int) 
derive instance Eq Witness

data Msg =
      ShowWitness Witness
    | SelectAllParams
    | UnselectAllParams
    | Compute
    | AddVertex PointerEvent
    | SelectVertex Int PointerEvent
    | PointerUp Int
    | GraphMove PointerEvent
    | DeleteVertex Int PointerEvent
    | DeleteEdge Edge
    | DropOrLeave
    | SetEditMode EditMode
    | ClearGraph

update :: Msg -> Update Model Aff Unit
update (AddVertex ev) = do
    pos ← liftEffect $ pointerDecoder ev
    case pos of
        Nothing → pure unit
        Just p →
            modify_ \model → 
                if model.editmode == VertexMode then
                    model{graph = Graph.addVertex p model.graph}
                else
                    model
update (SelectVertex i ev) = do
    liftEffect $ stopPropagation $ PE.toEvent ev
    modify_ \model →
        if model.editmode `elem` [AddEMode, VertexMode] then
            model{selectedVertex = Just i}
        else
            model
update (GraphMove ev) = do 
    pos ← liftEffect $ pointerDecoder ev
    modify_ \model →
            case pos, model.editmode, model.selectedVertex of
                Just p, VertexMode, Just i →
                    model{graph = Graph.moveVertex i p model.graph}
                Just p, AddEMode, _ →
                    model{currentPosition = Just p}
                _, _, _ → model            

update DropOrLeave =
        modify_ \model →
            if model.editmode == AddEMode then
                model{selectedVertex = Nothing}
            else  
                model

update (PointerUp i) = do
    modify_ \model →
            case model.editmode, model.selectedVertex of
                VertexMode, _ →
                    model{selectedVertex = Nothing, currentPosition = Nothing}
                AddEMode, Just j →
                    model{graph = Graph.addEdge i j model.graph, selectedVertex = Nothing}
                _, _ → model

update (DeleteEdge (Edge u v)) =
        modify_ \model →
            if model.editmode == DeleteMode then
                model{graph = Graph.removeEdge u v model.graph}
            else
                model

update (SetEditMode mode) = modify_ _{editmode = mode}
update _ = pure unit