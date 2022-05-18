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
import GraphParams.Monad (MonadGP)
import Pha.Update (Update, get, modify_)
import Util (pointerDecoder)
import GraphParams.Data (codeExample)

data EditMode = VertexMode | AddEMode | DeleteMode
derive instance Eq EditMode

type Position = { x :: Number, y :: Number}

type Model =
  { witness :: Witness
  , isComputing :: Boolean
  , code :: String
  , error :: Maybe String
  , parameters :: Array Parameter
  , results :: Array (Maybe Result)
  , graph ∷ Graph
  , editmode ∷ EditMode
  , selectedVertex ∷ Maybe Int
  , currentPosition ∷ Maybe Position
  }

init :: Model
init =
  { witness: NoWitness
  , isComputing: false
  , code: codeExample
  , error: Nothing
  , parameters
  , results: const (Just {value: "1", witness: SetWitness [1]}) <$> parameters
  , graph: {layout: [], edges: []}
  , editmode: VertexMode
  , selectedVertex: Nothing
  , currentPosition: Nothing
  }

type Parameter =
  { cat :: Int
  , name :: String
  , hardness :: Int
  , fullname :: String
  , selected :: Boolean
  }

type Result =
  { value :: String
  , witness :: Witness
  }

data Witness 
  = NoWitness 
  | ColorWitness (Array Int)
  | SetWitness (Array Int)
  | EdgeWitness (Array Edge)

derive instance Eq Witness

data Msg
  = ShowWitness Witness
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

parameters :: Array Parameter
parameters = 
  [ { cat: 1, hardness: 0, name: "order", fullname: "order" }
  , { cat: 1, hardness: 0, name: "nbedges", fullname: "number of edges" }
  , { cat: 1, hardness: 0, name: "mindegree", fullname: "minimun degree" }
  , { cat: 1, hardness: 0, name: "maxdegree", fullname: "maximum degree" }
  , { cat: 1, hardness: 0, name: "degen", fullname: "degeneracy" }
  , { cat: 1, hardness: 0, name: "diameter", fullname: "diameter" }
  , { cat: 1, hardness: 0, name: "girth", fullname: "girth" }
  , { cat: 1, hardness: 0, name: "matching", fullname: "maximum matching" }
  , { cat: 1, hardness: 2, name: "tw", fullname: "treewidth" }

  , { cat: 2, hardness: 0, name: "regular", fullname: "regular" }
  , { cat: 2, hardness: 0, name: "connected", fullname: "connected" }
  , { cat: 2, hardness: 1, name: "hamilton", fullname: "hamiltonian" }
  , { cat: 2, hardness: 0, name: "chordal", fullname: "chordal" }

  , { cat: 3, hardness: 1, name: "mis", fullname: "independent set" }
  , { cat: 3, hardness: 1, name: "clique", fullname: "clique" }
  , { cat: 3, hardness: 1, name: "chromatic", fullname: "chromatic number" }
  , { cat: 4, hardness: 1, name: "dom", fullname: "dominating set" }
  , { cat: 4, hardness: 1, name: "totaldom", fullname: "total dominating set" }
  , { cat: 4, hardness: 1, name: "inddom", fullname: "independent dominating set" }
  , { cat: 4, hardness: 2, name: "cdom", fullname: "connected dominating set" }
  , { cat: 4, hardness: 1, name: "idcode", fullname: "identifying code" }
  , { cat: 4, hardness: 1, name: "locdom", fullname: "locating dominating set" }
  ] <#> \{cat, hardness, name, fullname} -> { cat, hardness, name, fullname, selected: hardness <= 1}


update :: Msg -> Update Model MonadGP Unit
update (ShowWitness witness) = modify_ _{ witness = witness }

update SelectAllParams = modify_ \model ->
    model { parameters = model.parameters <#> (_{selected = true})}

update UnselectAllParams = modify_ \model ->
    model { parameters = model.parameters  <#> (_{selected = false})}

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
            VertexMode, _ → model{selectedVertex = Nothing, currentPosition = Nothing}
            AddEMode, Just j → model{graph = Graph.addEdge i j model.graph, selectedVertex = Nothing}
            _, _ → model

update (DeleteVertex i ev) = do
  st ← get
  when (st.editmode == VertexMode)
    (liftEffect $ stopPropagation $ PE.toEvent ev)
  modify_ \model →
    if model.editmode == DeleteMode then
      model{graph = Graph.removeVertex i model.graph}
    else
      model

update (DeleteEdge (Edge u v)) =
  modify_ \model →
    if model.editmode == DeleteMode then
      model{graph = Graph.removeEdge u v model.graph}
    else
      model

update ClearGraph = modify_ _ {graph = { layout: [], edges: [] }}

update (SetEditMode mode) = modify_ _{editmode = mode}
update _ = pure unit
