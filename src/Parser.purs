module GraphParams.Parser where

import Control.Lazy (fix)
import Data.Int as Int
import Data.List (List)
import Data.Maybe (Maybe(..))
import Prelude
import Control.Alt ((<|>))
import StringParser (Parser, fail, string, many1, sepBy, regex)

decimal :: forall m. Parser Int
decimal = do
  section <- decimalRegex <|> fail "Expected Int"
  case Int.fromString section of
    Nothing -> fail $ "Int.fromString failed"
    Just x -> pure x

decimalRegex :: Parser String
decimalRegex = regex "[0-9]+"

function :: Parser (List Int)
function = name *> string "(" *> (arguments <* string "$")
    where
    name = regex "[a-zA-Z]+"
    arguments = decimal `sepBy` string ","
    