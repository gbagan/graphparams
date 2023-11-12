module GraphParams.Msg where

import Web.UIEvent.MouseEvent (MouseEvent)
import Web.PointerEvent (PointerEvent)
import GraphParams.Graph (Edge)
import GraphParams.Model (Certificate, EditMode)

data Msg
  = ShowCertificate Certificate
  | CheckParam String Boolean
  | SelectAllParams
  | UnselectAllParams
  | Compute
  | SetCode String
  | AddVertex MouseEvent
  | SelectVertex Int PointerEvent
  | PointerUp Int
  | GraphMove PointerEvent
  | DeleteVertex Int MouseEvent
  | DeleteEdge Edge
  | DropOrLeave
  | SetEditMode EditMode
  | ClearGraph
  | AdjustGraph
  | GenerateGraph