module GraphParams.Model where

import Prelude
import Data.Maybe (Maybe(..))
import Web.PointerEvent (PointerEvent)

data Edge = Edge Int Int

data EditMode = Plop

instance Eq Edge where
    eq (Edge u v) (Edge u' v') = u == u' && v == v' || u == v' && v == u'  

type Position = { x :: Number, y :: Number}

type Graph =
    {   edges :: Array Edge
    ,   layout :: Array {}
    }

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

type Parameter =
    {   result :: Maybe Result
    ,   fullname :: String
    }

type Result =
    {   value :: String
    ,   witness :: Witness
    }

data Witness = NoWitness | ColorWitness (Array Int) | SetWitness (Array Int) 

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
    | SetMode EditMode
    | ClearGraph
