module Main where

import Prelude
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Pha.App (app)
import GraphParams.Model (init, update)
import GraphParams.View (view)

main :: Effect Unit
main =
    app
    {   init: {state: init, action: Nothing}
    ,   update
    ,   view
    ,   eval: identity
    ,   subscriptions: []
    ,   selector: "#root"
    }
