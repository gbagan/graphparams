module Main where

import Relude hiding (view)

import Control.Monad.Reader (runReaderT)
import Effect.Aff (launchAff_)
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
  {send, receive} <- makeChannel worker
  liftEffect $ app
    { init: { model: init, msg: Nothing }
    , update: hoist (flip runReaderT {send, receive}) <<< update
    , view
    , selector: "#root"
    }
