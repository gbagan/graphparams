module GraphParams.Update where

import Prelude

import Data.Array (elem, filter, length)
import Data.Either (Either(..))
import Data.Foldable (for_)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Effect.Class (liftEffect)
import Effect.Aff.Class (liftAff)
import Control.Monad.Reader.Class (ask)
import Control.Monad.Trans.Class (lift)
import GraphParams.Graph (Edge(..))
import GraphParams.Graph as Graph
import GraphParams.DecodeResult (decodeResult)
import GraphParams.Parser (parseGraph)
import GraphParams.Layout (computeLayout)
import GraphParams.Model (Model, EditMode(..))
import GraphParams.Monad (MonadGP)
import GraphParams.Msg (Msg(..))
import Pha.Update (Update, get, modify_)
import Util (pointerDecoder)
import Web.Event.Event (stopPropagation)
import Web.PointerEvent.PointerEvent as PE

update ∷ Msg → Update Model MonadGP Unit
update (ShowWitness witness) = modify_ _ { witness = witness }

update (CheckParam name checked) =
  modify_ \model →
    model { parameters = model.parameters <#> \p → if p.name == name then p { selected = checked } else p }

update SelectAllParams =
  modify_ \model →
    model { parameters = model.parameters <#> (_ { selected = true }) }

update UnselectAllParams =
  modify_ \model →
    model { parameters = model.parameters <#> (_ { selected = false }) }

update (SetCode code) = modify_ _ { code = code }

update GenerateGraph =
  modify_ \model →
    case parseGraph model.code of
      Left error → model { error = Just error }
      Right {n, edges} →
         let layout = computeLayout n edges
         in
          model { graph = { edges, layout }}

update Compute = do
  modify_ _{ results = Map.empty :: _, error = Nothing, isComputing = true }
  {pull, push} <- lift ask
  {graph, parameters} <- get
  for_ (filter _.selected parameters) \{name} → do
    liftAff $ push {graph: Graph.toAdjGraph graph, param: name}
    res <- liftAff $ pull
    for_ (decodeResult res) \res' →
      modify_ \model → model{results = Map.insert name res' model.results}
  modify_ _{ isComputing = false }

update (AddVertex ev) = do
  pos ← liftEffect $ pointerDecoder ev
  case pos of
    Nothing → pure unit
    Just p →
      modify_ \model →
        if model.editmode == VertexMode then
          model { graph = Graph.addVertex p model.graph }
        else
          model

update (SelectVertex i ev) = do
  liftEffect $ stopPropagation $ PE.toEvent ev
  modify_ \model →
    if model.editmode `elem` [ AddEMode, MoveMode ] then
      model { selectedVertex = Just i }
    else
      model

update (GraphMove ev) = do
  pos ← liftEffect $ pointerDecoder ev
  modify_ \model → case pos, model.editmode, model.selectedVertex of
    Just p, MoveMode, Just i → model { graph = Graph.moveVertex i p model.graph }
    Just p, AddEMode, _ → model { currentPosition = Just p }
    _, _, _ → model

update DropOrLeave =
  modify_ \model →
    if model.editmode == AddEMode then
      model { selectedVertex = Nothing }
    else
      model

update (PointerUp i) = do
  modify_ \model → case model.editmode, model.selectedVertex of
    MoveMode, _ → model { selectedVertex = Nothing, currentPosition = Nothing }
    AddEMode, Just j → model { graph = Graph.addEdge i j model.graph, selectedVertex = Nothing }
    _, _ → model

update (DeleteVertex i ev) = do
  st ← get
  when (st.editmode == MoveMode)
    (liftEffect $ stopPropagation $ PE.toEvent ev)
  modify_ \model →
    if model.editmode == DeleteMode then
      model { graph = Graph.removeVertex i model.graph }
    else
      model

update (DeleteEdge (Edge u v)) =
  modify_ \model →
    if model.editmode == DeleteMode then
      model { graph = Graph.removeEdge u v model.graph }
    else
      model

update ClearGraph = modify_ _ { graph = { layout: [], edges: [] } }

update (SetEditMode mode) = modify_ \model → model { editmode = mode, results = if model.editmode == MoveMode then model.results else Map.empty }

update AdjustGraph = modify_ \model@{ graph } → model { graph = graph { layout = computeLayout (length $ graph.layout) graph.edges } }
