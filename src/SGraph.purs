module GraphParams.SGraph where

import Prelude hiding (join)
import Control.Alternative (guard)
import Data.Array ((..), elem, foldr, snoc, tail, zipWith)
import Data.Array.NonEmpty as NEA
import Data.Maybe (Maybe(..), maybe)
import GraphParams.Graph (Edge(..))

type SGraph
  = { n ∷ Int
    , edges ∷ Array Edge
    }

union ∷ SGraph → SGraph → SGraph
union g1 g2 =
  { n: g1.n + g2.n
  , edges: g1.edges <> (g2.edges <#> \(Edge u v) → Edge (u + g1.n) (v + g1.n))
  }

join ∷ SGraph → SGraph → SGraph
join g1 g2 =
  { n: g1.n + g2.n
  , edges: g1.edges <> (g2.edges <#> \(Edge u v) → Edge (u + g1.n) (v + g1.n)) <> between
  }
  where
  between = do
    i <- 0 .. (g1.n - 1)
    j <- 0 .. (g2.n - 1)
    pure $ Edge i (j + g1.n)

product ∷ SGraph → SGraph → SGraph
product g1 g2 =
  { n: g1.n * g2.n
  , edges: hedges <> vedges
  }
  where
  hedges = do
    i <- 0 .. (g1.n - 1)
    Edge j k <- g2.edges
    pure $ Edge (i * g2.n + j) (i * g2.n + k)

  vedges = do
    i <- 0 .. (g2.n - 1)
    Edge j k <- g1.edges
    pure $ Edge (j * g2.n + i) (k * g2.n + i)

graph ∷ Int → SGraph
graph n = { n, edges: [] }

path ∷ Int → SGraph
path n = graph n # addPath (0 .. (n - 1))

cycle ∷ Int → SGraph
cycle n = graph n # addCycle (0 .. (n - 1))

clique ∷ Int → SGraph
clique n = graph n # addClique (0 .. (n - 1))

biclique ∷ Int → Int → SGraph
biclique n m = graph n `join` graph m

grid ∷ Int → Int → SGraph
grid n m = path n `product` path m

star ∷ Int → SGraph
star = biclique 1

addEdge ∷ Int → Int → SGraph → SGraph
addEdge u v g = g { edges = if Edge u v `elem` g.edges then g.edges else g.edges `snoc` Edge u v }

addEdges ∷ Array Edge → SGraph → SGraph
addEdges edges g = edges # (foldr \(Edge u v) → addEdge u v) g

addPath ∷ Array Int → SGraph → SGraph
addPath p = addEdges $ maybe [] (zipWith Edge p) (tail p)

addCycle ∷ Array Int → SGraph → SGraph
addCycle c g = case NEA.fromArray c of
  Nothing → g
  Just c' → g # addPath c # addEdge (NEA.head c') (NEA.last c')

addClique ∷ Array Int → SGraph → SGraph
addClique set g =
  g
    # addEdges do
        u <- set
        v <- set
        guard $ u /= v
        pure $ Edge u v

petersen ∷ SGraph
petersen =
  graph 10
    # addCycle [ 0, 1, 2, 3, 4 ]
    # addCycle [ 5, 7, 9, 6, 8 ]
    # addEdges [ Edge 0 5, Edge 1 6, Edge 2 7, Edge 3 8, Edge 4 9 ]
