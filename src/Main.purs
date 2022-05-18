module Main where

import Prelude
import Control.Monad.Reader (runReaderT)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Pha.App (app)
import GraphParams.Model (init)
import GraphParams.Update (update)
import GraphParams.View (view)

main :: Effect Unit
main = do
  -- worker <- new "worker.js" default
  app
    { init: { state: init, action: Nothing }
    , update
    , view
    , eval: flip runReaderT 10
    , subscriptions: []
    , selector: "#root"
    }
