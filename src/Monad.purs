module GraphParams.Monad where

import Prelude
import Effect.Class (class MonadEffect)
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Control.Monad.Reader.Trans (ReaderT, class MonadAsk, class MonadReader)
import Control.Monad.Rec.Class (class MonadRec)
-- import Effect.Random (randomInt, random)

newtype MonadGP a = MonadGP (ReaderT Int Aff a)

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

{-
instance MonadGen MonadMam where
    chooseInt a b = MonadMam $ liftEffect $ randomInt a b
    chooseFloat a b = MonadMam $ liftEffect $ random <#> \n -> a + (b - a) * n
    chooseBool = MonadMam $ liftEffect $ (_ == 0) <$> randomInt 0 1
    resize _ m = m
    sized f = f 0
-}
