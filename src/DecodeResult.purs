module GraphParams.DecodeResult where

import Prelude

import Control.Monad.Except (runExcept)
import Data.Either (hush)
import Data.Array (cons, elem, filter, tail, zipWith)
import Data.List (List(..), (:))
import Data.List as List
import Data.Maybe (Maybe, maybe)
import Data.Traversable (traverse)
import Foreign (Foreign, readString, readArray, readInt)
import Foreign.Index ((!))
import GraphParams.Graph (Edge(..))
import GraphParams.Model (Result, Certificate(..))

decodeEdges :: Array Int -> Array Edge
decodeEdges = go <<< List.fromFoldable where
  go Nil = []
  go (_ : Nil) = []
  go (x : y : xs) = cons (Edge x y) (go xs)  

edgesFromPath :: Array Int -> Array Edge
edgesFromPath p = maybe [] (zipWith Edge p) (tail p)

decodeResult :: Array Edge -> Foreign → Maybe Result
decodeResult edges res =
  hush
    $ runExcept do
        value <- res ! "result" >>= readString
        ctype <- res ! "ctype" >>= readString
        wit <- res ! "certificate" >>= readArray >>= traverse readInt
        let
          certificate = case ctype of
            "nocertificate" → NoCertificate
            "set" -> Certificate wit []
            "order" -> OrderCertificate wit
            "path" -> Certificate wit (edgesFromPath wit) -- todo
            "color" -> ColorCertificate wit
            "edges" -> Certificate wit (decodeEdges wit)
            "subgraph" -> Certificate wit (edges # filter \(Edge u v) -> u `elem` wit && v `elem` wit)
            _ → NoCertificate
        pure { value, certificate }
