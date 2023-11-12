module GraphParams.Monad where

import Relude
import Foreign (Foreign)
import GraphParams.Graph (AdjGraph)

type InputData
  = { param :: String
    , graph :: AdjGraph
    }

type MonadGP
  = ReaderT { send :: InputData -> Aff Unit, receive :: Aff Foreign } Aff

