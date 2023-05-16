module GraphParams.Channel where

import Prelude
import Foreign (Foreign)
import Effect.Aff (Aff, launchAff_, forkAff)
import Web.Worker.Worker (Worker, postMessage, onMessage)
import Web.Worker.MessageEvent (data_)
import Effect.Aff.AVar as AVar
import Effect.Class (liftEffect)
import Control.Monad.Rec.Class (forever)

makeChannel :: forall a. Worker -> Aff { send :: a -> Aff Unit, receive :: Aff Foreign }
makeChannel worker = do
  res <- AVar.empty
  req <- AVar.empty
  liftEffect $ worker # onMessage \m -> launchAff_ (AVar.put m res)
  _ <-
    forkAff
      $ forever do
          msg <- AVar.take req
          liftEffect $ worker # postMessage msg
  pure $ { send: flip AVar.put req, receive: data_ <$> AVar.take res }
