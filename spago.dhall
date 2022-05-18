{ name = "graphparams"
, dependencies =
  [ "aff"
  , "arrays"
  , "control"
  , "effect"
  , "integers"
  , "lists"
  , "maybe"
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
