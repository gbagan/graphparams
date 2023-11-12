module GraphParams.Monad where

import Prelude
import Effect.Aff (Aff)
import Foreign (Foreign)
import Control.Monad.Reader.Trans (ReaderT)
import GraphParams.Graph (AdjGraph)

type InputData
  = { param :: String
    , graph :: AdjGraph
    }

type MonadGP
  = ReaderT { send :: InputData -> Aff Unit, receive :: Aff Foreign } Aff

