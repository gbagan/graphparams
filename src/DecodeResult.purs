module GraphParams.DecodeResult where

import Prelude
import Control.Monad.Except (runExcept)
import Data.Either (hush)
import Data.Traversable (traverse)
import Data.Maybe (Maybe)
import Foreign (Foreign, readString, readArray, readInt)
import Foreign.Index ((!))
import GraphParams.Model (Result(..), Witness(..))

decodeResult :: Foreign → Maybe Result
decodeResult res =
  hush
    $ runExcept do
        value <- res ! "result" >>= readString
        wtype <- res ! "wtype" >>= readString
        wit <- res ! "witness" >>= readArray >>= traverse readInt
        let
          witness = case wtype of
            "nowitness" → NoWitness
            "set" -> SetWitness wit
            "path" -> SetWitness wit -- todo
            "color" -> ColorWitness wit
            _ → NoWitness
        pure { value, witness }
