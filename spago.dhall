{ name = "graphparams"
, dependencies =
  [ "aff"
  , "arrays"
  , "bifunctors"
  , "control"
  , "effect"
  , "either"
  , "foldable-traversable"
  , "integers"
  , "lists"
  , "maybe"
  , "numbers"
  , "pha"
  , "prelude"
  , "string-parsers"
  , "strings"
  , "tailrec"
  , "transformers"
  , "tuples"
  , "web-dom"
  , "web-events"
  , "web-pointerevents"
  , "web-uievents"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
