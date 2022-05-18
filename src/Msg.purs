module GraphParams.Msg where

import Web.PointerEvent (PointerEvent)
import GraphParams.Graph (Edge)
import GraphParams.Model (Witness, EditMode)

data Msg
  = ShowWitness Witness
  | SelectAllParams
  | UnselectAllParams
  | Compute
  | SetCode String
  | AddVertex PointerEvent
  | SelectVertex Int PointerEvent
  | PointerUp Int
  | GraphMove PointerEvent
  | DeleteVertex Int PointerEvent
  | DeleteEdge Edge
  | DropOrLeave
  | SetEditMode EditMode
  | ClearGraph
  | AdjustGraph
  | GenerateGraph