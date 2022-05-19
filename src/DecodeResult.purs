module GraphParams.DecodeResult where

import Prelude

import Control.Monad.Except (runExcept)
import Data.Either (hush)
import Data.Array (cons, tail, zipWith)
import Data.List (List(..), (:))
import Data.List as List
import Data.Maybe (Maybe, maybe)
import Data.Traversable (traverse)
import Foreign (Foreign, readString, readArray, readInt)
import Foreign.Index ((!))
import GraphParams.Graph (Edge(..))
import GraphParams.Model (Result, Witness(..))

decodeEdges :: Array Int -> Array Edge
decodeEdges = go <<< List.fromFoldable where
  go Nil = []
  go (_ : Nil) = []
  go (x : y : xs) = cons (Edge x y) (go xs)  

edgesFromPath :: Array Int -> Array Edge
edgesFromPath p = maybe [] (zipWith Edge p) (tail p)

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
            "order" -> OrderWitness wit
            "path" -> EdgeWitness (edgesFromPath wit) -- todo
            "color" -> ColorWitness wit
            "edges" -> EdgeWitness (decodeEdges wit)
            _ → NoWitness
        pure { value, witness }
