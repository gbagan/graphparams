module GraphParams.Parser where

import Control.Lazy (fix)
import Data.List (List)
import Prelude
import Parsing (Parser)
import Parsing.Combinators (many1, sepBy)
import Parsing.String (string)
import Parsing.String.Basic (letter, intDecimal)

function :: Parser String (List Int)
function = name *> string "(" *> (arguments <* string "$")
    where
    name = many1 letter
    arguments = intDecimal `sepBy` string ","