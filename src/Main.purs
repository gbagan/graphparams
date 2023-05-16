module Main where

import Prelude

import Control.Monad.Reader (runReaderT)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class (liftEffect)
import GraphParams.Model (init)
import GraphParams.Update (update)
import GraphParams.View (view)
import GraphParams.Channel (makeChannel)
import Pha.Update (hoist)
import Pha.App (app)
import Web.Worker.Worker (defaultWorkerOptions, new)

main ∷ Effect Unit
main = launchAff_ do
  worker <- liftEffect $ new "worker.js" defaultWorkerOptions
  {pull, push} <- makeChannel worker
  liftEffect $ app
    { init: { model: init, msg: Nothing }
    , update: hoist (flip runReaderT {push, pull}) <<< update
    , view
    , selector: "#root"
    }
