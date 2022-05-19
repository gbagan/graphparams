module GraphParams.Monad where

import Prelude
-- import Effect.Class (class MonadEffect)
import Effect.Aff (Aff)
import Foreign (Foreign)
-- import Effect.Aff.Class (class MonadAff)
import Control.Monad.Reader.Trans (ReaderT) --, class MonadAsk, class MonadReader)
import GraphParams.Graph (AdjGraph)

-- import Control.Monad.Rec.Class (class MonadRec)
-- import Effect.Random (randomInt, random)

type InputData
  = { param :: String
    , graph :: AdjGraph
    }

type MonadGP
  = ReaderT { push :: InputData -> Aff Unit, pull :: Aff Foreign } Aff

{-
derive newtype instance Functor MonadGP
derive newtype instance Apply MonadGP
derive newtype instance Applicative MonadGP
derive newtype instance Bind MonadGP
instance Monad MonadGP
derive newtype instance MonadRec MonadGP
derive newtype instance MonadEffect MonadGP
derive newtype instance MonadAff MonadGP
derive newtype instance MonadAsk Int MonadGP
derive newtype instance MonadReader Int MonadGP
-}
{-
instance MonadGen MonadGP where
    chooseInt a b = MonadGP $ liftEffect $ randomInt a b
    chooseFloat a b = MonadGP $ liftEffect $ random <#> \n → a + (b - a) * n
    chooseBool = MonadGP $ liftEffect $ (_ == 0) <$> randomInt 0 1
    resize _ m = m
    sized f = f 0
-}
