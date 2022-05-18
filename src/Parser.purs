module GraphParams.Parser
  ( SGraph
  , parseGraph
  ) where

import Prelude

import Control.Alt ((<|>))
import Control.Alternative (guard)
import Control.Lazy (fix)
import Data.Array ((..), elem, foldr, snoc, tail, zipWith)
import Data.Array.NonEmpty as NEA
import Data.Bifunctor (bimap)
import Data.Either (Either(..), either)
import Data.Int as Int
import Data.List as List
import Data.List.NonEmpty (NonEmptyList, toUnfoldable)
import Data.Maybe (Maybe(..), maybe)
import GraphParams.Graph (Edge(..))
import StringParser (Parser, runParser, printParserError, fail, string, many, many1, sepBy1, regex, whiteSpace)

type SGraph
  = { n :: Int
    , edges :: Array Edge
    }

union :: SGraph -> SGraph -> SGraph
union g1 g2 =
  { n: g1.n + g2.n
  , edges: g1.edges <> (g2.edges <#> \(Edge u v) -> Edge (u + g1.n) (v + g1.n))
  }

graph :: Int -> SGraph
graph n = { n, edges: [] }

path :: Int -> SGraph
path n = graph n # addPath (0 .. (n-1))

cycle :: Int -> SGraph
cycle n = graph n # addCycle (0 .. (n-1))

clique :: Int -> SGraph
clique n = graph n # addClique (0 .. (n-1))

addEdge :: Int -> Int -> SGraph -> SGraph
addEdge u v g = g { edges = if Edge u v `elem` g.edges then g.edges else g.edges `snoc` Edge u v }

addEdges :: Array Edge -> SGraph -> SGraph
addEdges edges g = edges # (foldr \(Edge u v) -> addEdge u v) g

addPath :: Array Int -> SGraph -> SGraph
addPath p = addEdges $ maybe [] (zipWith Edge p) (tail p)
addCycle :: Array Int -> SGraph -> SGraph
addCycle c g =
  case NEA.fromArray c of
    Nothing -> g
    Just c' -> g # addPath c # addEdge (NEA.head c') (NEA.last c')

addClique :: Array Int -> SGraph -> SGraph
addClique set g = g # addEdges do
  u <- set
  v <- set
  guard $ u /= v
  pure $ Edge u v

decimal :: Parser Int
decimal = do
  section <- decimalRegex <|> fail "Expected Int"
  case Int.fromString section of
    Nothing -> fail $ "Int.fromString failed"
    Just x -> pure x

decimalRegex :: Parser String
decimalRegex = regex "[0-9]+"


arguments :: Parser (NonEmptyList Int)
arguments = (decimal <* whiteSpace) `sepBy1` (string "," <* whiteSpace)

function :: Parser SGraph
function = do
  f <- name
  args <- string "(" *> (arguments <* string ")")
  either fail pure (functionEval f args)
  where
  name = regex "[a-zA-Z]+"

functionEval :: String -> NonEmptyList Int -> Either String SGraph
functionEval s args =
  let
    args' = toUnfoldable args
  in
    case s of
      "graph" -> case args' of
        [ x ] -> Right $ graph x
        _ -> Left "graph: wrong number of arguments"
      "path" -> case args' of
        [ x ] -> Right $ path x
        _ -> Left "path: wrong number of arguments"
      "cycle" -> case args' of
        [ x ] -> Right $ cycle x
        _ -> Left "cycle: wrong number of arguments"
      "clique" -> case args' of
        [ x ] -> Right $ clique x
        _ -> Left "clique: wrong number of arguments"
      _ -> Left $ "no function is called: " <> s

method :: Parser (SGraph -> SGraph)
method = do
  f <- string "." *> name
  args <- string "(" *> (arguments <* string ")")
  either fail pure (methodEval f args)
  where
  name = regex "[a-zA-Z]+"

methodEval :: String -> NonEmptyList Int -> Either String (SGraph -> SGraph)
methodEval s args =
  let
    args' = toUnfoldable args
  in
    case s of
      "addEdge" -> case args' of
        [ x, y ] -> Right $ addEdge x y
        _ -> Left "addEdge: wrong number of arguments"
      "addPath" -> Right $ addPath args'
      "addCycle" -> Right $ addCycle args'
      "addClique" -> Right $ addClique args'
      _ -> Left $ "no method is called: " <> s

expr :: Parser SGraph
expr = List.foldl (#) <$> function <*> many method

parseGraph :: String -> Either String SGraph
parseGraph s = bimap printParserError identity (runParser expr s)