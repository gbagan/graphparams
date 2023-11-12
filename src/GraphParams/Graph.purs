module GraphParams.Graph where

import Relude

data Edge
  = Edge Int Int

infix 3 Edge as ↔

instance Eq Edge where
  eq (u1 ↔ v1) (u2 ↔ v2) = u1 == u2  && v1 == v2 || u1 == v2 && u2 == v1

incident ∷ Int → Edge → Boolean
incident v (u1 ↔ v1) = v == u1 || v == v1

type Position
  = { x ∷ Number
    , y ∷ Number
    }

-- | une structure Graph est composé d'un titre, d'une liste des arêtes et de la position de chaque sommet dans le plan
type Graph
  = { layout ∷ Array Position
    , edges ∷ Array Edge
    }

type AdjGraph
  = Array (Array Int)

getCoords ∷ Graph → Int → Maybe Position
getCoords graph u = graph.layout !! u

getCoordsOfEdge ∷ Graph → Edge → Maybe { x1 ∷ Number, x2 ∷ Number, y1 ∷ Number, y2 ∷ Number }
getCoordsOfEdge graph (u ↔ v) = do
  { x: x1, y: y1 } ← getCoords graph u
  { x: x2, y: y2 } ← getCoords graph v
  pure { x1, x2, y1, y2 }

addVertex ∷ Position → Graph → Graph
addVertex pos graph = graph { layout = graph.layout `snoc` pos }

removeVertex ∷ Int → Graph → Graph
removeVertex i graph =
  graph
    { layout = fromMaybe graph.layout $ graph.layout # deleteAt i
    , edges =
      graph.edges
        # mapMaybe \(u ↔ v) →
            if u == i || v == i then
              Nothing
            else
              Just $ (if u > i then u - 1 else u) ↔ (if v > i then v - 1 else v)
    }

removeEdge ∷ Int → Int → Graph → Graph
removeEdge u v graph = graph { edges = graph.edges # filter (_ /= (u ↔ v)) }

moveVertex ∷ Int → Position → Graph → Graph
moveVertex i pos graph = graph { layout = graph.layout # updateAtIndices [ i /\ pos ] }

addEdge ∷ Int → Int → Graph → Graph
addEdge u v graph =
  graph
    { edges =
      if u == v || (u ↔ v) `elem` graph.edges then
        graph.edges
      else
        graph.edges `snoc` (u ↔ v)
    }

toAdjGraph :: Graph → AdjGraph
toAdjGraph g =
  foldr
    (\(u ↔ v) → modifyAtIndices [ u ] (_ `snoc` v) <<< modifyAtIndices [ v ] (_ `snoc` u))
    (g.layout <#> const [])
    g.edges
