module GraphParams.Parser
  ( parseGraph
  ) where

import Prelude
import Control.Alt ((<|>))
import Control.Lazy (fix)
import Data.Bifunctor (bimap)
import Data.Either (Either(..), either)
import Data.Int as Int
import Data.List as List
import Data.List.NonEmpty (NonEmptyList, toUnfoldable)
import Data.Maybe (Maybe(..))
import GraphParams.SGraph (SGraph)
import GraphParams.SGraph as SG
import StringParser (Parser, runParser, printParserError, fail, string, many, many1, sepBy1, regex, whiteSpace, try)

decimal ∷ Parser Int
decimal = do
  section <- decimalRegex <|> fail "Expected Int"
  case Int.fromString section of
    Nothing → fail $ "Int.fromString failed"
    Just x → pure x

decimalRegex ∷ Parser String
decimalRegex = regex "[0-9]+"

arguments ∷ Parser (NonEmptyList Int)
arguments = (decimal <* whiteSpace) `sepBy1` (string "," <* whiteSpace)

function ∷ Parser SGraph
function = do
  f <- name
  args <- string "(" *> (arguments <* string ")")
  either fail pure (evalFunction f args)
  where
  name = regex "[a-zA-Z]+"

constant ∷ Parser SGraph
constant = do
  c <- regex "[a-zA-Z]+"
  either fail pure (evalConstant c)

evalFunction ∷ String → NonEmptyList Int → Either String SGraph
evalFunction s args =
  let
    args' = toUnfoldable args
  in
    case s of
      "graph" → case args' of
        [ x ] → Right $ SG.graph x
        _ → Left "graph: wrong number of arguments"
      "path" → case args' of
        [ x ] → Right $ SG.path x
        _ → Left "path: wrong number of arguments"
      "cycle" → case args' of
        [ x ] → Right $ SG.cycle x
        _ → Left "cycle: wrong number of arguments"
      "clique" → case args' of
        [ x ] → Right $ SG.clique x
        _ → Left "clique: wrong number of arguments"
      "biclique" → case args' of
        [ x, y ] → Right $ SG.biclique x y
        _ → Left "biclique: wrong number of arguments"
      "star" → case args' of
        [ x ] → Right $ SG.star x
        _ → Left "biclique: wrong number of arguments"
      "grid" → case args' of
        [ x, y ] → Right $ SG.grid x y
        _ → Left "grid: wrong number of arguments"
      "petersen" → case args' of
        [] → Right SG.petersen
        _ → Left "petersen: takes no argument"
      _ → Left $ "no function is called: " <> s

evalConstant ∷ String → Either String SGraph
evalConstant s = case s of
  "petersen" → Right SG.petersen
  _ → Left $ "no constant is called: " <> s

method ∷ Parser (SGraph → SGraph)
method = do
  f <- string "." *> name
  args <- string "(" *> (arguments <* string ")")
  either fail pure (methodEval f args)
  where
  name = regex "[a-zA-Z]+"

methodEval ∷ String → NonEmptyList Int → Either String (SGraph → SGraph)
methodEval s args =
  let
    args' = toUnfoldable args
  in
    case s of
      "addEdge" → case args' of
        [ x, y ] → Right $ SG.addEdge x y
        _ → Left "addEdge: wrong number of arguments"
      "addPath" → Right $ SG.addPath args'
      "addCycle" → Right $ SG.addCycle args'
      "addClique" → Right $ SG.addClique args'
      _ → Left $ "no method is called: " <> s

expr ∷ Parser SGraph
expr = List.foldl (#) <$> (try function <|> constant) <*> many method

parseGraph ∷ String → Either String SGraph
parseGraph s = bimap printParserError identity (runParser expr s)
