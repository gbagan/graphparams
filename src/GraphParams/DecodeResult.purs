module GraphParams.DecodeResult where

import Relude
import Control.Monad.Except (runExcept)
import Data.Either (hush)
import Data.List ((:))
import Data.List as List
import Foreign (Foreign, readString, readArray, readInt)
import Foreign.Index ((!))
import GraphParams.Graph (Edge(..))
import GraphParams.Model (Result, Certificate(..))

decodeEdges :: Array Int -> Array Edge
decodeEdges = go <<< List.fromFoldable
  where
  go Nil = []
  go (_ : Nil) = []
  go (x : y : xs) = cons (Edge x y) (go xs)

edgesFromPath :: Array Int -> Array Edge
edgesFromPath p = maybe [] (zipWith Edge p) (tail p)

reversePermutation ∷ Array Int -> Array Int
reversePermutation p =
  replicate (length p) 0
    # updateAtIndices (p # mapWithIndex \i j -> j /\ i)

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
            "order" -> OrderCertificate (reversePermutation wit)
            "path" -> Certificate wit (edgesFromPath wit) -- todo
            "color" -> ColorCertificate wit
            "edges" -> Certificate wit (decodeEdges wit)
            "subgraph" -> Certificate wit (edges # filter \(Edge u v) -> u `elem` wit && v `elem` wit)
            _ → NoCertificate
        pure { value, certificate }
