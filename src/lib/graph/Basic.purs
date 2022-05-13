module Lib.Graph.Basic where

import Prelude
import Data.Array (foldl, length)
import Data.Foldable (minimum, maximum)
import Data.Maybe (fromMaybe)

type Graph = Array (Array Int)

nbVertices :: Graph -> Int
nbVertices = length

nbEdges :: Graph -> Int
nbEdges g = foldl (\acc nbor -> acc + length nbor) 0 g / 2

minDegree :: Graph -> Int
minDegree = fromMaybe 0 <<< minimum <<< map length 

maxDegree :: Graph -> Int
maxDegree = fromMaybe 0 <<< maximum <<< map length 

isRegular :: Graph -> Boolean
isRegular g = minDegree g == maxDegree g

{-
export const minDegree = graph => min(map(nbor => nbor.length, graph));
export const maxDegree = graph => max(map(nbor => nbor.length, graph));
export const isRegular = graph  => minDegree(graph) === maxDegree(graph);
-}